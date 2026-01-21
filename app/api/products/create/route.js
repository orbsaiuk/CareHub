import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createProduct } from "@/services/sanity/products";
import { writeClient } from "@/sanity/lib/serverClient";
import { USER_MEMBERSHIPS_BY_TENANT_QUERY } from "@/sanity/queries/user";
import { TENANT_DOC_ID_BY_TYPE_AND_TENANT_ID_QUERY } from "@/sanity/queries/tenant";

async function ensureUserMembership(userId, tenantType, tenantId) {
  const user = await writeClient.fetch(USER_MEMBERSHIPS_BY_TENANT_QUERY, {
    userId,
    tenantType,
    tenantId,
  });
  return Boolean(user?.memberships?.length);
}

async function validateTenant(tenantType, tenantId) {
  const tenant = await writeClient.fetch(
    TENANT_DOC_ID_BY_TYPE_AND_TENANT_ID_QUERY,
    { tenantType, tenantId }
  );
  return tenant?._id;
}

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type");
    let productData;
    let imageFile = null;

    if (contentType?.includes("multipart/form-data")) {
      // Handle multipart form data (with image)
      const formData = await request.formData();
      const jsonData = formData.get("json");
      imageFile = formData.get("file");

      if (!jsonData) {
        return NextResponse.json(
          { error: "البيانات المطلوبة مفقودة" },
          { status: 400 }
        );
      }

      productData = JSON.parse(jsonData);
    } else {
      // Handle JSON data (without image)
      productData = await request.json();
    }

    // Extract data from the request
    const {
      title,
      description,
      price,
      quantity,
      currency,
      weightUnit,
      tenantType,
      tenantId,
    } = productData;

    if (!tenantType || !tenantId || !title) {
      return NextResponse.json(
        { error: "البيانات المطلوبة مفقودة" },
        { status: 400 }
      );
    }

    const allowedType = tenantType === "company" || tenantType === "supplier";
    if (!allowedType) {
      return NextResponse.json(
        { error: "نوع المستأجر غير صحيح" },
        { status: 400 }
      );
    }

    const hasAccess = await ensureUserMembership(userId, tenantType, tenantId);
    if (!hasAccess) {
      return NextResponse.json({ error: "ليس لديك صلاحية" }, { status: 403 });
    }

    // Validate tenant exists
    const validTenantId = await validateTenant(tenantType, tenantId);
    if (!validTenantId) {
      return NextResponse.json({ error: "الحساب غير موجود" }, { status: 404 });
    }

    let imageAsset = null;
    if (imageFile && imageFile.size > 0) {
      try {
        const imageBuffer = await imageFile.arrayBuffer();
        imageAsset = await writeClient.assets.upload(
          "image",
          Buffer.from(imageBuffer),
          {
            filename: imageFile.name,
          }
        );
      } catch (error) {
        return NextResponse.json(
          { error: "فشل في رفع الصورة" },
          { status: 500 }
        );
      }
    }

    const finalProductData = {
      title,
      description,
      price,
      quantity,
      currency,
      weightUnit,
      tenantType,
      tenantId,
      tenantDocId: validTenantId, // Pass the tenant document ID for reference
      imageAsset,
    };

    const product = await createProduct(finalProductData);

    return NextResponse.json({
      ok: true,
      product,
      message: "تم إنشاء المنتج بنجاح",
    });
  } catch (error) {
    return NextResponse.json({ error: "فشل في إنشاء المنتج" }, { status: 500 });
  }
}
