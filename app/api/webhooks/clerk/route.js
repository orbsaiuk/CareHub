import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { writeClient } from "@/sanity/lib/serverClient";
import { clerkClient } from "@clerk/nextjs/server";
import { USER_BY_ID_OR_CLERKID_QUERY } from "@/sanity/queries/user";

export async function POST(req) {
  // Read headers FIRST
  const h = await headers();
  const svixId = h.get("svix-id");
  const svixTimestamp = h.get("svix-timestamp");
  const svixSignature = h.get("svix-signature");

  // Read body AFTER headers
  const payload = await req.text();

  const isDev = process.env.NODE_ENV === "development";
  const secret = process.env.CLERK_WEBHOOK_SECRET;

  // Validate secret in production only
  if (!isDev && !secret) {
    return NextResponse.json(
      { error: "Webhook secret not set" },
      { status: 500 }
    );
  }

  let evt;

  /**
   * ============================
   *  VERIFY WEBHOOK
   * ============================
   */
  if (isDev) {
    // 🧪 DEV MODE → skip signature verification
    try {
      evt = JSON.parse(payload);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }
  } else {
    // 🔐 PROD MODE → verify signature
    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json(
        { error: "Missing Svix headers" },
        { status: 400 }
      );
    }

    try {
      const wh = new Webhook(secret);
      evt = wh.verify(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }
  }

  const type = evt?.type;
  const data = evt?.data || {};

  /**
   * ============================
   *  USER CREATED / UPDATED
   * ============================
   */
  if (type === "user.created" || type === "user.updated") {
    const isCreatedEvent = type === "user.created";

    const clerkId = data.id;
    const email = data.email_addresses?.[0]?.email_address || "";
    const firstName = data.first_name || "";
    const lastName = data.last_name || "";
    const username = data.username || "";

    // Fallback name
    let name = `${firstName} ${lastName}`.trim();
    if (!name && username) name = username;

    const imageUrl = data.image_url || "";

    const publicRole = data.public_metadata?.role;
    const unsafeRole = data.unsafe_metadata?.role;

    const resolvedRole =
      typeof publicRole === "string" && publicRole.trim()
        ? publicRole
        : typeof unsafeRole === "string" && unsafeRole.trim()
          ? unsafeRole
          : "user";

    /**
     * Ensure publicMetadata.role on creation
     */
    if (isCreatedEvent && publicRole !== resolvedRole) {
      try {
        await clerkClient.users.updateUser(clerkId, {
          publicMetadata: {
            ...(data.public_metadata || {}),
            role: resolvedRole,
          },
        });
      } catch (err) {
        // silent fail
      }
    }

    const deterministicId = `user.${clerkId}`;

    /**
     * Find existing user by _id or clerkId
     */
    const existing = await writeClient.fetch(
      USER_BY_ID_OR_CLERKID_QUERY,
      {
        id: deterministicId,
        clerkId,
      }
    );

    const targetId = existing?._id || deterministicId;

    /**
     * Create if not exists
     */
    if (!existing) {
      await writeClient.create({
        _id: targetId,
        _type: "user",
        clerkId,
        email,
        name,
        imageUrl,
        role: resolvedRole,
      });
    }

    /**
     * Always update
     */
    await writeClient
      .patch(targetId)
      .set({
        clerkId,
        email,
        name,
        imageUrl,
        role: resolvedRole,
      })
      .commit({ autoGenerateArrayKeys: true });
  }

  /**
   * ============================
   *  USER DELETED (OPTIONAL)
   * ============================
   */
  // if (type === "user.deleted") {
  //   const clerkId = data.id;
  //   const _id = `user.${clerkId}`;
  //   // soft delete or cleanup if needed
  // }

  return NextResponse.json({ ok: true });
}
