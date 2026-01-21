import { getCurrentSubscription } from "@/services/sanity/subscriptions";
import { writeClient } from "@/sanity/lib/serverClient";
import { TENANT_NAME_BY_TYPE_AND_TENANT_ID_QUERY } from "@/sanity/queries/subscriptions";

async function getTenantName(tenantType, tenantId) {
    try {
        return (
            (await writeClient.fetch(TENANT_NAME_BY_TYPE_AND_TENANT_ID_QUERY, {
                tenantType,
                tenantId,
            })) || "Unknown"
        );
    } catch {
        return "Unknown";
    }
}

// Check if tenant has used trial for a specific plan
async function hasUsedTrialForPlan(tenantType, tenantId, planId) {
    try {
        const query = `count(*[_type == "subscription" && tenantType == $tenantType && tenantId == $tenantId && plan._ref == $planId && (trialStatus == "converted" || trialStatus == "expired" || trialStatus == "flexible" || trialStatus == "converted_to_free")]) > 0`;
        return await writeClient.fetch(query, { tenantType, tenantId, planId });
    } catch {
        return false;
    }
}

export async function checkTrialEligibility(tenantType, tenantId, planId = null) {
    try {
        if (!["company", "supplier"].includes(tenantType)) {
            return { eligible: false, reason: "Invalid tenant type" };
        }

        if (!tenantId?.trim()) {
            return { eligible: false, reason: "Invalid tenant ID" };
        }

        const tenantName = await getTenantName(tenantType, tenantId);
        if (tenantName === "Unknown") {
            return { eligible: false, reason: "Tenant not found" };
        }

        const subscription = await getCurrentSubscription(tenantType, tenantId);

        // Not eligible if already on trial
        if (subscription?.status === "trialing") {
            return { eligible: false, reason: "You already have an active trial" };
        }

        // Check per-plan trial usage if planId provided
        if (planId) {
            const usedTrialForPlan = await hasUsedTrialForPlan(tenantType, tenantId, planId);
            if (usedTrialForPlan) {
                return { eligible: false, reason: "You have already used the free trial for this plan" };
            }
        }

        return { eligible: true, reason: "Eligible for trial" };
    } catch (error) {
        throw error;
    }
}
