import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/serverClient";

async function getAuthorNameByClerkId(clerkId) {
  try {
    // First try to get from Sanity
    const data = await writeClient.fetch(
      `*[_type=="user" && clerkId == $uid][0]{ name }`,
      { uid: clerkId }
    );

    const sanityName = (data?.name || "").trim();
    if (sanityName) {
      return sanityName;
    }

    // Fallback to Clerk API if not found in Sanity
    const { clerkClient } = await import("@clerk/nextjs/server");
    const clerkUser = await clerkClient.users.getUser(clerkId);

    const firstName = clerkUser.firstName || "";
    const lastName = clerkUser.lastName || "";
    const username = clerkUser.username || "";

    let name = `${firstName} ${lastName}`.trim();
    if (!name && username) name = username;
    if (!name && clerkUser.emailAddresses?.[0]?.emailAddress) {
      // Use email prefix as last resort
      name = clerkUser.emailAddresses[0].emailAddress.split("@")[0];
    }

    // If we got a name from Clerk but user doesn't exist in Sanity, create/update the user
    if (name && name !== "Anonymous") {
      const deterministicId = `user.${clerkId}`;
      try {
        await writeClient.createOrReplace({
          _id: deterministicId,
          _type: "user",
          clerkId,
          name,
          email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
          imageUrl: clerkUser.imageUrl || "",
          role: clerkUser.publicMetadata?.role || "user",
        });
      } catch (error) {
        console.error("Error creating/updating user in Sanity:", error);
      }
    }

    return name || "Anonymous";
  } catch (error) {
    console.error("Error getting author name:", error);
    return "Anonymous";
  }
}

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const { companyId, rating, title, content } = body || {};

    if (!companyId || typeof rating !== "number") {
      return new NextResponse("Missing fields", { status: 400 });
    }
    const normalizedRating = Math.max(1, Math.min(5, Math.round(rating)));

    // Resolve company by tenantId or slug
    const company = await writeClient.fetch(
      `*[_type == "company" && (tenantId == $id || slug.current == $id)][0]{ _id, rating, ratingCount, tenantId }`,
      { id: companyId }
    );
    if (!company?._id)
      return new NextResponse("Company not found", { status: 404 });

    // Check if user already has a review for this tenant
    const existingReview = await writeClient.fetch(
      `*[_type == "review" && tenantType == "company" && tenantId == $tenantId && authorClerkId == $userId][0]{ _id }`,
      { tenantId: company.tenantId || companyId, userId }
    );

    if (existingReview?._id) {
      return new NextResponse("You have already reviewed this company", { status: 409 });
    }

    const authorName = await getAuthorNameByClerkId(userId);

    const reviewDoc = {
      _type: "review",
      tenantType: "company",
      tenantId: company.tenantId || companyId,
      company: { _type: "reference", _ref: company._id },
      rating: normalizedRating,
      title: (title || "").slice(0, 140),
      content: (content || "").slice(0, 5000),
      authorName: authorName || "Anonymous",
      authorClerkId: userId,
      createdAt: new Date().toISOString(),
    };

    const created = await writeClient.create(reviewDoc);

    // Update aggregates (simple incremental calculation)
    const prevAvg = Number(company.rating || 0);
    const prevCount = Number(company.ratingCount || 0);
    const newCount = prevCount + 1;
    const newAvg = Number(
      ((prevAvg * prevCount + normalizedRating) / newCount).toFixed(2)
    );

    await writeClient
      .patch(company._id)
      .set({ rating: newAvg, ratingCount: newCount })
      .commit();

    return NextResponse.json({
      ok: true,
      reviewId: created._id,
      _id: created._id,
      authorName: authorName || "Anonymous",
      authorClerkId: userId,
      title: (title || "").slice(0, 140),
      content: (content || "").slice(0, 5000),
      rating: normalizedRating,
      companyRating: newAvg,
      ratingCount: newCount,
    });
  } catch (err) {
    console.error("Failed to create review", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
