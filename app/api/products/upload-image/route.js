import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/serverClient";

export async function POST(request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json(
                { error: "الملف مطلوب" },
                { status: 400 }
            );
        }

        // Upload image to Sanity
        const imageAsset = await writeClient.assets.upload("image", file);

        // Return Sanity image object format
        const image = {
            _type: "image",
            asset: {
                _type: "reference",
                _ref: imageAsset._id,
            },
        };

        return NextResponse.json({
            ok: true,
            image,
        });
    } catch (error) {
        console.error("Upload image error:", error);
        return NextResponse.json(
            { error: "فشل في رفع الصورة" },
            { status: 500 }
        );
    }
}
