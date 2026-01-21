import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { updateProductOffer } from "@/services/sanity/products";
import { writeClient } from "@/sanity/lib/serverClient";
import { USER_MEMBERSHIPS_BY_TENANT_QUERY } from "@/sanity/queries/user";
import { PRODUCT_BY_ID_WITH_OWNERSHIP_QUERY } from "@/sanity/queries/products";

// Validation schema for offer update data
const offerUpdateSchema = z
    .object({
        productId: z.string().min(1, "معرف المنتج مطلوب"),
        offerType: z.enum(["percentage", "fixed"], {
            errorMap: () => ({ message: "نوع العرض يجب أن يكون نسبة مئوية أو مبلغ ثابت" }),
        }),
        offerValue: z.number().positive("قيمة العرض يجب أن تكون أكبر من صفر"),
        offerStatus: z.enum(["active", "inactive"], {
            errorMap: () => ({ message: "حالة العرض يجب أن تكون نشط أو غير نشط" }),
        }),
    })
    .refine(
        (data) => {
            // Percentage must be between 1 and 100
            if (data.offerType === "percentage") {
                return data.offerValue >= 1 && data.offerValue <= 100;
            }
            return true;
        },
        {
            message: "نسبة الخصم يجب أن تكون بين 1 و 100",
            path: ["offerValue"],
        }
    );

// Helper function to check user membership
async function ensureUserMembership(userId, tenantType, tenantId) {
    const user = await writeClient.fetch(
        `*[_type == "user" && clerkId == $userId][0]{
      memberships[tenantType == $tenantType && tenantId == $tenantId]{ tenantId }
    }`,
        { userId, tenantType, tenantId }
    );
    return Boolean(user?.memberships?.length);
}

// Helper function to get product and validate ownership
async function getProductAndValidateOwnership(productId, userId) {
    const product = await writeClient.fetch(
        `*[_type == "product" && _id == $productId][0]{
      _id,
      title,
      price,
      hasOffer,
      tenantType,
      tenantId
    }`,
        { productId }
    );

    if (!product) {
        return { error: "المنتج غير موجود", status: 404 };
    }

    if (!product.hasOffer) {
        return { error: "المنتج لا يحتوي على عرض", status: 400 };
    }

    const hasAccess = await ensureUserMembership(
        userId,
        product.tenantType,
        product.tenantId
    );

    if (!hasAccess) {
        return { error: "ليس لديك صلاحية لتعديل هذا المنتج", status: 403 };
    }

    return { product };
}

export async function POST(request) {
    try {
        // Check authentication
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        // Parse request body
        const body = await request.json();

        // Validate request data
        const validation = offerUpdateSchema.safeParse(body);
        if (!validation.success) {
            const errors = validation.error.errors.map((err) => ({
                field: err.path.join("."),
                message: err.message,
            }));
            return NextResponse.json(
                { error: "بيانات غير صالحة", details: errors },
                { status: 400 }
            );
        }

        const { productId, ...offerData } = validation.data;

        // Get product and validate ownership
        const productResult = await getProductAndValidateOwnership(productId, userId);
        if (productResult.error) {
            return NextResponse.json(
                { error: productResult.error },
                { status: productResult.status }
            );
        }

        const { product } = productResult;

        // Additional validation: fixed amount must be less than product price
        if (offerData.offerType === "fixed" && offerData.offerValue >= product.price) {
            return NextResponse.json(
                { error: "قيمة الخصم يجب أن تكون أقل من سعر المنتج" },
                { status: 400 }
            );
        }

        // Update offer
        const updatedProduct = await updateProductOffer(productId, offerData);

        return NextResponse.json({
            success: true,
            product: updatedProduct,
            message: "تم تحديث العرض بنجاح",
        });
    } catch (error) {
        console.error("Error updating product offer:", error);
        return NextResponse.json(
            { error: "فشل في تحديث العرض" },
            { status: 500 }
        );
    }
}
