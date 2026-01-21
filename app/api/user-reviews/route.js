import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/serverClient";
import { UserReviewService } from "@/services/sanity/UserReviewService";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const rawLimit = Number(searchParams.get("limit") || 3);
  const limit = Math.max(1, Math.min(100, rawLimit));
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  if (!id) return new NextResponse("Missing id", { status: 400 });

  try {
    const data = await UserReviewService.listReviews({
      idOrClerkId: id,
      page,
      limit,
    });
    return NextResponse.json({ ok: true, ...data });
  } catch (err) {
    console.error("GET /api/user-reviews error", err);
    return new NextResponse("Server error", { status: 500 });
  }
}

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const { targetUserId, rating, title, content, companyTenantId } =
      body || {};

    if (!targetUserId || typeof rating !== "number") {
      return new NextResponse("Missing fields", { status: 400 });
    }
    const normalizedRating = Math.max(1, Math.min(5, Math.round(rating)));

    // Get author name with fallback to Clerk API
    let authorName = "";
    try {
      // First try to get from Sanity
      const author = await writeClient.fetch(
        `*[_type=="user" && clerkId == $uid][0]{ name }`,
        { uid: userId }
      );
      authorName = (author?.name || "").trim();

      // Fallback to Clerk API if not found in Sanity
      if (!authorName) {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const clerkUser = await clerkClient.users.getUser(userId);

        const firstName = clerkUser.firstName || "";
        const lastName = clerkUser.lastName || "";
        const username = clerkUser.username || "";

        let name = `${firstName} ${lastName}`.trim();
        if (!name && username) name = username;
        if (!name && clerkUser.emailAddresses?.[0]?.emailAddress) {
          name = clerkUser.emailAddresses[0].emailAddress.split("@")[0];
        }

        authorName = name;

        // Create/update user in Sanity if we got a name
        if (name && name !== "Anonymous") {
          const deterministicId = `user.${userId}`;
          try {
            await writeClient.createOrReplace({
              _id: deterministicId,
              _type: "user",
              clerkId: userId,
              name,
              email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
              imageUrl: clerkUser.imageUrl || "",
              role: clerkUser.publicMetadata?.role || "user",
            });
          } catch (error) {
            console.error("Error creating/updating user in Sanity:", error);
          }
        }
      }
    } catch (_) { }
    const result = await UserReviewService.createReview({
      targetUserId,
      rating: normalizedRating,
      title,
      content,
      authorName: authorName || "Company",
      companyTenantId,
    });

    if (result?.error) return new NextResponse(result.error, { status: 404 });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("POST /api/user-reviews error", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
