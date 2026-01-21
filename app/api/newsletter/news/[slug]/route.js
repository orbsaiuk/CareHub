import { NextResponse } from "next/server";
import { getNewsBySlug } from "@/services/sanity/newsletter";

export async function GET(request, { params }) {
    try {
        const resolvedParams = await params;
        const { slug } = resolvedParams;

        if (!slug) {
            return NextResponse.json(
                { error: "Slug is required" },
                { status: 400 }
            );
        }

        const newsItem = await getNewsBySlug(slug);

        if (!newsItem) {
            return NextResponse.json(
                { error: "News item not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            title: newsItem.title,
            slug: newsItem.slug?.current,
        });
    } catch (error) {
        console.error("Error fetching news item:", error);
        return NextResponse.json(
            { error: "Failed to fetch news item" },
            { status: 500 }
        );
    }
}
