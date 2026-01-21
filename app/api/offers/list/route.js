import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/serverClient";
import { getOffersForTenant } from "@/services/sanity/offers";

/**
 * Ensure user is a member of the tenant
 */
async function ensureUserMembership(userId, tenantType, tenantId) {
    const user = await writeClient.fetch(
        `*[_type == "user" && clerkId == $userId][0]{
      memberships[tenantType == $tenantType && tenantId == $tenantId]{ tenantId }
    }`,
        { userId, tenantType, tenantId }
    );
    return Boolean(user?.memberships?.length);
}

export async function GET(request) {
    try {
        // Authentication check
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const tenantType = searchParams.get("tenantType");
        const tenantId = searchParams.get("tenantId");

        // Validate required parameters
        if (!tenantType || !tenantId) {
            return NextResponse.json(
                { error: "معاملات الاستعلام المطلوبة مفقودة" },
                { status: 400 }
            );
        }

        // Validate tenant type
        if (tenantType !== "company" && tenantType !== "supplier") {
            return NextResponse.json(
                { error: "نوع المستأجر غير صحيح" },
                { status: 400 }
            );
        }

        // Tenant membership verification
        const hasAccess = await ensureUserMembership(userId, tenantType, tenantId);
        if (!hasAccess) {
            return NextResponse.json({ error: "ليس لديك صلاحية" }, { status: 403 });
        }

        // Fetch all offers for the tenant
        const { items, stats } = await getOffersForTenant(tenantType, tenantId);

        return NextResponse.json({
            ok: true,
            offers: items || [],
            stats: stats || { total: 0, active: 0, inactive: 0 },
        });
    } catch (error) {
        console.error("Error fetching offers:", error);
        return NextResponse.json(
            { error: "فشل في جلب العروض" },
            { status: 500 }
        );
    }
}
