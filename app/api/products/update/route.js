import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateProduct } from "@/services/sanity/products";

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const productData = await request.json();
    const { id, image, ...updateData } = productData;

    if (!id) {
      return NextResponse.json({ error: "معرف المنتج مطلوب" }, { status: 400 });
    }

    // Pass the image reference directly (it's already a Sanity image object)
    const updatedProduct = await updateProduct(id, {
      ...updateData,
      image, // Pass the complete image object
    });

    return NextResponse.json({
      ok: true,
      message: "تم تحديث المنتج بنجاح",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    if (error.message?.includes("not found")) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ error: "فشل في تحديث المنتج" }, { status: 500 });
  }
}
