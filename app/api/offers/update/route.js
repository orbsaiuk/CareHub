import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/serverClient";
import { USER_MEMBERSHIPS_BY_TENANT_QUERY } from "@/sanity/queries/offer";

function toPortableText(text) {
    if (!text) return undefined;
    if (Array.isArray(text)) return text;
    return [
        {
            _type: "block",
            style: "normal",
            markDefs: [],
            children: [{ _type: "span", text: String(text), marks: [] }],
        },
    ];
}

async function ensureUserMembership(userId, tenantType, tenantId) {
    const user = await writeClient.fetch(USER_MEMBERSHIPS_BY_TENANT_QUERY, {
        userId,
        tenantType,
        tenantId,
    });
    return Boolean(user?.memberships?.length);
}

export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Parse body based on Content-Type
        const contentType = (req.headers.get("content-type") || "").toLowerCase();
        let body = {};
        let fileImageRef = undefined;

        if (contentType.includes("multipart/form-data")) {
            const form = await req.formData();
            const json = form.get("json");
            const file = form.get("file");
            body = json ? JSON.parse(json) : {};
            if (file && typeof file !== "string") {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const asset = await writeClient.assets.upload("image", buffer, {
                    filename: file.name || "offer.jpg",
                    contentType: file.type || "image/jpeg",
                });
                fileImageRef = {
                    _type: "image",
                    asset: { _type: "reference", _ref: asset._id },
                };
            }
        } else {
            body = await req.json().catch(() => ({}));
        }

        const {
            offerId,
            tenantType,
            tenantId,
            title,
            status,
            description,
            startDate,
            endDate,
        } = body || {};

        if (!offerId || !tenantType || !tenantId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const allowedType = tenantType === "company" || tenantType === "supplier";
        if (!allowedType) {
            return NextResponse.json(
                { error: "Invalid tenantType" },
                { status: 400 }
            );
        }

        const hasAccess = await ensureUserMembership(userId, tenantType, tenantId);
        if (!hasAccess) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        // Verify offer exists and belongs to tenant
        const existingOffer = await writeClient.fetch(
            `*[_type == "offers" && _id == $offerId && tenantType == $tenantType && tenantId == $tenantId][0]`,
            { offerId, tenantType, tenantId }
        );

        if (!existingOffer) {
            return NextResponse.json({ error: "Offer not found" }, { status: 404 });
        }

        // Validate dates
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (end < start) {
                return NextResponse.json(
                    { error: "End date must be on or after start date" },
                    { status: 400 }
                );
            }
        }

        // Compute status based on dates
        const computeOfferStatus = (startDate, endDate, requestedStatus) => {
            const now = new Date();
            now.setHours(0, 0, 0, 0);

            // If explicitly set to inactive, keep it
            if (requestedStatus === "inactive") {
                return "inactive";
            }

            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                if (now < start) {
                    return "scheduled";
                }
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                if (now > end) {
                    return "expired";
                }
            }

            return "active";
        };

        const computedStatus = computeOfferStatus(startDate, endDate, status);

        // Build update object - only include fields that have values
        const updateData = {
            status: computedStatus,
            startDate: startDate ? String(startDate) : existingOffer.startDate,
            updatedAt: new Date().toISOString(),
        };

        // Handle title - can be empty string to remove it
        if (title && title.trim()) {
            updateData.title = String(title).slice(0, 200);
        }

        // Handle description - can be empty string to remove it
        if (description && description.trim()) {
            updateData.description = toPortableText(description);
        }

        // Handle endDate - can be null to remove it
        if (endDate === null) {
            updateData.endDate = undefined;
        } else if (endDate) {
            updateData.endDate = String(endDate);
        }

        // Add image if new one uploaded
        if (fileImageRef) {
            updateData.image = fileImageRef;
        }

        // Build list of fields to unset (remove)
        const fieldsToUnset = [];
        if (title !== undefined && (!title || !title.trim())) {
            fieldsToUnset.push("title");
        }
        if (description !== undefined && (!description || !description.trim())) {
            fieldsToUnset.push("description");
        }

        // Apply update with set and unset
        let patch = writeClient.patch(offerId).set(updateData);
        if (fieldsToUnset.length > 0) {
            patch = patch.unset(fieldsToUnset);
        }
        const updated = await patch.commit();

        return NextResponse.json({ ok: true, offer: updated });
    } catch (err) {
        console.error("Error updating offer:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
