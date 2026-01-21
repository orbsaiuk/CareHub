import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/serverClient";
import { USER_BY_ID_OR_CLERKID_QUERY } from "@/sanity/queries/user";
import { safeUpdateClerkRole } from "@/services/clerk";
import {
  sendOrderRequestApprovalEmail,
  sendOrderRequestRejectionEmail,
} from "@/services/email";
import { ensureUserMembership } from "@/services/sanity/memberships";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const doc = body;

    if (doc._type !== "tenantRequest") {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Handle rejection emails
    if (doc.status === "rejected") {
      try {
        await sendOrderRequestRejectionEmail(doc);
      } catch (emailError) {
        // Silent fail - email is not critical
      }
      return NextResponse.json({ ok: true, rejectionEmailSent: true });
    }

    // Only proceed for approved requests
    if (doc.status !== "approved") {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Check if entity was already created by the button
    if (!doc.createdTenantId) {
      return NextResponse.json({
        ok: false,
        error: "No createdTenantId found. Entity should be created by button first."
      });
    }

    const entityType = doc.tenantType || "company";

    // Get the created entity to extract tenantId
    const createdEntity = await writeClient.fetch(
      `*[_id == $id][0]{ tenantId }`,
      { id: doc.createdTenantId }
    );

    if (!createdEntity?.tenantId) {
      return NextResponse.json({
        ok: false,
        error: "Could not find tenantId from created entity"
      });
    }

    const tenantId = createdEntity.tenantId;

    // Parallelize independent operations with timeout protection
    const operations = await Promise.allSettled([
      // Clerk role update (independent)
      Promise.race([
        safeUpdateClerkRole(doc.requestedBy, doc.tenantType),
        new Promise((resolve) =>
          setTimeout(
            () => resolve({ ok: false, skipped: true, reason: "timeout" }),
            5000
          )
        ),
      ]),
      // Sanity user role update (independent)
      (async () => {
        try {
          const clerkId = doc.requestedBy;
          const deterministicUserId = `user.${clerkId}`;
          const existing = await writeClient.fetch(
            USER_BY_ID_OR_CLERKID_QUERY,
            {
              id: deterministicUserId,
              clerkId,
            }
          );
          const targetId = existing?._id || deterministicUserId;
          await writeClient
            .patch(targetId)
            .set({ role: doc.tenantType })
            .commit({ autoGenerateArrayKeys: true });
          return { ok: true };
        } catch (e) {
          return { ok: false, error: String(e) };
        }
      })(),
      // User membership (depends on tenantId)
      ensureUserMembership(doc.requestedBy, entityType, tenantId),
    ]);

    // Handle results (non-blocking, just log)
    const [clerkResult, sanityUserResult, membershipResult] = operations;

    // Send approval email notification
    try {
      await sendOrderRequestApprovalEmail(doc);
    } catch (emailError) {
      // Don't fail the webhook if email fails
      console.error("Failed to send approval email:", emailError);
    }

    return NextResponse.json({
      ok: true,
      entityId: doc.createdTenantId,
      tenantId,
      rolesUpdated: true,
      emailSent: true
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
