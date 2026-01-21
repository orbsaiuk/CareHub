/**
 * Trial Access Control Utilities
 * Used by UI components to check subscription/trial status
 */

export function checkTrialAccess(subscription) {
    if (!subscription) {
        return { hasAccess: false, reason: "No subscription found", daysRemaining: 0 };
    }

    // Active subscription - full access
    if (subscription.status === "active") {
        return { hasAccess: true, reason: "Active subscription", daysRemaining: null };
    }

    // Trialing
    if (subscription.status === "trialing") {
        // Flexible trial - unlimited access (no end date)
        if (subscription.trialStatus === "flexible") {
            return {
                hasAccess: true,
                reason: "Flexible trial",
                daysRemaining: null,
                isFlexibleTrial: true,
            };
        }

        // Fixed trial - check end date
        if (subscription.trialEndDate) {
            const now = new Date();
            const trialEnd = new Date(subscription.trialEndDate);
            const daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));

            if (daysRemaining > 0) {
                return {
                    hasAccess: true,
                    reason: "Active trial",
                    daysRemaining,
                    isExpiringSoon: daysRemaining <= 3,
                };
            }
        }
    }

    // No access
    return {
        hasAccess: false,
        reason: subscription.status === "expired" ? "Subscription expired" : `Status: ${subscription.status}`,
        daysRemaining: 0,
    };
}

export function getTrialStatusSummary(subscription) {
    if (!subscription) {
        return { status: "none", message: "No subscription found" };
    }

    const access = checkTrialAccess(subscription);

    return {
        status: subscription.status,
        trialStatus: subscription.trialStatus,
        hasAccess: access.hasAccess,
        daysRemaining: access.daysRemaining,
        isExpiringSoon: access.isExpiringSoon,
        isFlexibleTrial: access.isFlexibleTrial,
        trialEndDate: subscription.trialEndDate,
    };
}
