import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/serverClient";
import { revalidatePath } from "next/cache";
import {
  USER_MEMBERSHIPS_BY_TENANT_QUERY,
  OFFER_BY_ID_FULL_QUERY,
} from "@/sanity/queries/offer";

async function ensureUserMembership(userId, tenantType, tenantId) {
  const user = await writeClient.fetch(USER_MEMBERSHIPS_BY_TENANT_QUERY, {
    userId,
    tenantType,
    tenantId,
  });
  return Boolean(user?.memberships?.length);
}

export async function POST(req) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { offerId, tenantType, tenantId } = await req.json().catch(() => ({}));

  // Validate required fields
  if (!offerId || !tenantType || !tenantId) {
    return NextResponse.json({ error: "Missing required data" }, { status: 400 });
  }

  try {
    // Validate tenant type
    const allowedType = tenantType === "company" || tenantType === "supplier";
    if (!allowedType) {
      return NextResponse.json({ error: "Invalid tenant" }, { status: 400 });
    }

    // Tenant membership verification
    const hasAccess = await ensureUserMembership(userId, tenantType, tenantId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Load offer to verify ownership
    const offer = await writeClient.fetch(OFFER_BY_ID_FULL_QUERY, { offerId });

    if (!offer?._id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Verify offer belongs to the tenant
    if (offer.tenantId !== tenantId || offer.tenantType !== tenantType) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Remove back-reference from parent document (if exists), then delete the offer
    const parentId =
      offer.tenantType === "company" ? offer.company?._id : offer.supplier?._id;
    const tx = writeClient.transaction();
    if (parentId) {
      tx.patch(parentId, (p) => p.unset([`offers[_ref == "${offerId}"]`]));
    }
    tx.delete(offerId);
    await tx.commit().catch((e) => {
      throw new Error(
        `Sanity transaction failed: ${e?.message || "unknown error"}`
      );
    });

    // Revalidate the corresponding business offers page
    try {
      const path = `/business/${offer.tenantType}/offers`;
      revalidatePath(path);
    } catch (_) {
      // ignore
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      {
        error: e?.message
          ? `Failed to delete offer: ${e.message}`
          : "Failed to delete offer",
      },
      { status: 500 }
    );
  }
}
