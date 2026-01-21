import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { removeProductOffer } from "@/services/sanity/products";
import { writeClient } from "@/sanity/lib/serverClient";
import { USER_MEMBERSHIPS_BY_TENANT_QUERY } from "@/sanity/queries/user";
import { PRODUCT_BY_ID_WITH_OWNERSHIP_QUERY } from "@/sanity/queries/products";

// Validation schema for remove request
const removeOfferSchema = z.object({
    productId: z.string().min(1, "معرف المنتج مطلوب"),
});

// Helper function to check user membership
async function ensureUserMembership(userId, tenantType, tenantId) {
    const user = await writeClient.fetch(USER_MEMBERSHIPS_BY_TENANT_QUERY, {
        userId,
        tenantType,
        tenantId,
    });
    return Boolean(user?.memberships?.length);
}

// Helper function to get product and validate ownership
async function getProductAndValidateOwnership(productId, userId) {
    const product = await writeClient.fetch(
        PRODUCT_BY_ID_WITH_OWNERSHIP_QUERY,
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
        const validation = removeOfferSchema.safeParse(body);
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

        const { productId } = validation.data;

        // Get product and validate ownership
        const productResult = await getProductAndValidateOwnership(productId, userId);
        if (productResult.error) {
            return NextResponse.json(
                { error: productResult.error },
                { status: productResult.status }
            );
        }

        // Remove offer from product
        const updatedProduct = await removeProductOffer(productId);

        // Check if product is in any offer pages and remove it from products field
        const offerPagesWithProduct = await writeClient.fetch(
            `*[_type == "offersPage" && references($productId)]{_id, products}`,
            { productId }
        );

        let deletedOfferPages = 0;
        let updatedOfferPages = 0;

        // Process each offer page that references the product
        if (offerPagesWithProduct.length > 0) {
            const processPromises = offerPagesWithProduct.map(async (offerPage) => {
                // Check if this is the last product in the offer page
                const remainingProducts = offerPage.products.filter(
                    (p) => p._ref !== productId
                );

                if (remainingProducts.length === 0) {
                    // Delete the entire offer page if no products remain
                    await writeClient.delete(offerPage._id);
                    deletedOfferPages++;
                } else {
                    // Remove only the product reference
                    await writeClient
                        .patch(offerPage._id)
                        .unset([`products[_ref=="${productId}"]`])
                        .commit();
                    updatedOfferPages++;
                }
            });
            await Promise.all(processPromises);
        }

        return NextResponse.json({
            success: true,
            product: updatedProduct,
            message: "تم إزالة العرض بنجاح",
            removedFromOfferPages: offerPagesWithProduct.length,
            deletedOfferPages,
            updatedOfferPages,
        });
    } catch (error) {
        console.error("Error removing product offer:", error);
        return NextResponse.json(
            { error: "فشل في إزالة العرض" },
            { status: 500 }
        );
    }
}
