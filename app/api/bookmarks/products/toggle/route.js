export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/serverClient";
import { randomUUID } from "crypto";
import { USER_ID_BY_CLERK_ID_QUERY } from "@/sanity/queries/user";

export async function POST(req) {
    const { userId } = await auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    let body;
    try {
        body = await req.json();
    } catch (_) {
        return new Response("Invalid JSON", { status: 400 });
    }

    const productId = body?.productId;
    if (!productId || typeof productId !== "string") {
        return new Response("Missing productId", { status: 400 });
    }

    try {
        const userDoc = await writeClient.fetch(USER_ID_BY_CLERK_ID_QUERY, {
            uid: userId,
        });
        if (!userDoc?._id) return new Response("User not found", { status: 404 });

        const product = await writeClient.fetch(
            `*[_type == "product" && _id == $productId][0]`,
            { productId }
        );
        if (!product?._id)
            return new Response("Product not found", { status: 404 });

        const fullUser = await writeClient.fetch(
            `*[_type == "user" && _id == $uid][0]`,
            { uid: userDoc._id }
        );

        const bookmarkExists = fullUser?.productBookmarks?.some(
            (b) => b._ref === product._id
        );

        if (bookmarkExists) {
            const filteredBookmarks = (fullUser.productBookmarks || []).filter(
                (bookmark) => bookmark._ref !== product._id
            );

            await writeClient
                .patch(userDoc._id)
                .set({ productBookmarks: filteredBookmarks })
                .commit();

            return Response.json({ bookmarked: false });
        } else {
            await writeClient
                .patch(userDoc._id)
                .setIfMissing({ productBookmarks: [] })
                .append("productBookmarks", [
                    {
                        _type: "reference",
                        _ref: product._id,
                        _weak: true,
                        _key: randomUUID(),
                    },
                ])
                .commit();

            return Response.json({ bookmarked: true });
        }
    } catch (err) {
        return new Response("Server error", { status: 500 });
    }
}
