import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/serverClient";
import { uuid } from "@sanity/uuid";

export const runtime = "nodejs";

export async function POST(request) {
    // Verify the request has a valid Sanity token
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { tenantRequestId, action, rejectionReason } = await request.json();

        if (!tenantRequestId) {
            return NextResponse.json(
                { error: "Missing tenantRequestId" },
                { status: 400 }
            );
        }

        if (!action || !["approve", "reject"].includes(action)) {
            return NextResponse.json(
                { error: "Invalid action. Must be 'approve' or 'reject'" },
                { status: 400 }
            );
        }

        // Fetch the tenant request with user info
        const tenantRequest = await writeClient.fetch(
            `*[_id == $id][0]{
                ...,
                "businessTypeId": businessType._ref,
                "userClerkId": user->clerkId
            }`,
            { id: tenantRequestId }
        );

        if (!tenantRequest) {
            return NextResponse.json(
                { error: "Tenant request not found" },
                { status: 404 }
            );
        }

        if (tenantRequest.status !== "pending") {
            return NextResponse.json(
                { error: `Request is already ${tenantRequest.status}` },
                { status: 400 }
            );
        }

        const targetType = tenantRequest.tenantType;

        // Handle REJECT action - just update status
        if (action === "reject") {
            await writeClient
                .patch(tenantRequestId)
                .set({
                    status: "rejected",
                    rejectionReason: rejectionReason || null,
                })
                .commit();

            return NextResponse.json({
                ok: true,
                message: `Successfully rejected ${targetType}: ${tenantRequest.name}`,
            });
        }

        // Handle APPROVE action - create document and update status
        const tenantId = uuid();

        // Generate slug - support Arabic and other Unicode characters
        let slugText = tenantRequest.name
            ?.toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\u0600-\u06FFa-z0-9\-]/g, "")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "");

        if (!slugText) {
            slugText = tenantId;
        }

        // Prepare the new tenant document
        const newTenant = {
            _type: targetType,
            tenantType: targetType,
            tenantId: tenantId,
            name: tenantRequest.name,
            slug: {
                _type: "slug",
                current: slugText,
            },
            description: tenantRequest.description
                ? [
                    {
                        _type: "block",
                        _key: uuid(),
                        style: "normal",
                        children: [
                            {
                                _type: "span",
                                _key: uuid(),
                                text: tenantRequest.description,
                                marks: [],
                            },
                        ],
                        markDefs: [],
                    },
                ]
                : undefined,
            website: tenantRequest.website || undefined,
            logo: tenantRequest.logo || undefined,
            totalEmployees: tenantRequest.totalEmployees || undefined,
            foundingYear: tenantRequest.foundingYear || undefined,
            registrationNumber: tenantRequest.registrationNumber || undefined,
            businessType: tenantRequest.businessTypeId
                ? {
                    _type: "reference",
                    _ref: tenantRequest.businessTypeId,
                }
                : undefined,
            socialLinks: tenantRequest.socialLinks || undefined,
            contact: tenantRequest.contact || undefined,
            locations: tenantRequest.locations
                ? tenantRequest.locations.map((loc) => ({
                    ...loc,
                    _key: loc._key || uuid(),
                }))
                : undefined,
            openingHours: tenantRequest.openingHours || undefined,
        };

        // Create the new tenant document
        const createdTenant = await writeClient.create(newTenant);

        // Update the tenant request to mark it as approved
        // This will trigger the webhook which handles emails, roles, memberships
        await writeClient
            .patch(tenantRequestId)
            .set({
                status: "approved",
                createdTenantId: createdTenant._id,
            })
            .commit();

        return NextResponse.json({
            ok: true,
            tenantId: createdTenant._id,
            tenantType: targetType,
            message: `Successfully created ${targetType}: ${tenantRequest.name}. Webhook will handle emails and roles.`,
        });
    } catch (error) {
        console.error("Failed to process tenant request:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
