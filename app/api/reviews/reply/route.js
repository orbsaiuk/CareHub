import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/serverClient";
import { USER_COMPANY_MEMBERSHIPS_QUERY } from "@/sanity/queries/company";

export async function POST(req) {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();
        const { reviewId, content } = body || {};

        if (!reviewId || !content?.trim()) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        // Get user's company membership
        const user = await writeClient.fetch(USER_COMPANY_MEMBERSHIPS_QUERY, { userId });
        const membership = user?.memberships?.[0];

        if (!membership?.tenantId) {
            return new NextResponse("No company membership found", { status: 403 });
        }

        // Get the review and verify it belongs to user's company
        const review = await writeClient.fetch(
            `*[_type == "review" && _id == $reviewId][0]{ _id, tenantId }`,
            { reviewId }
        );

        if (!review) {
            return new NextResponse("Review not found", { status: 404 });
        }

        if (review.tenantId !== membership.tenantId) {
            return new NextResponse("Not authorized to reply to this review", { status: 403 });
        }

        // Update the review with the reply
        const updated = await writeClient
            .patch(reviewId)
            .set({
                reply: {
                    content: content.trim().slice(0, 800),
                    repliedAt: new Date().toISOString(),
                },
            })
            .commit();

        return NextResponse.json({ ok: true, review: updated });
    } catch (err) {
        console.error("Failed to reply to review", err);
        return new NextResponse("Server error", { status: 500 });
    }
}
