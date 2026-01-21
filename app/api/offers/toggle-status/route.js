import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/serverClient";
import { OFFER_BY_ID_DATES_QUERY } from "@/sanity/queries/offer";

// Helper function to compute status based on dates
function computeOfferStatus(startDate, endDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    if (now < start) {
      return "scheduled";
    }
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    if (now > end) {
      return "expired";
    }
  }

  return "active";
}

export async function POST(req) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = await req.json().catch(() => ({}));
  if (!id || !status)
    return NextResponse.json({ error: "Missing" }, { status: 400 });
  try {
    // Fetch current offer to check dates
    const offer = await writeClient.fetch(OFFER_BY_ID_DATES_QUERY, { id });

    // Compute the actual status based on dates
    const computedStatus = computeOfferStatus(offer?.startDate, offer?.endDate);

    // If trying to toggle to active but dates indicate otherwise, use computed status
    const finalStatus = status === "active" ? computedStatus : status;

    const patch = writeClient.patch(id).set({ status: finalStatus });
    if (finalStatus === "inactive") {
      patch.set({ deactivatedAt: new Date().toISOString() });
    } else {
      patch.unset(["deactivatedAt"]);
    }
    await patch.commit();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
