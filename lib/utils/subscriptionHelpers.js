/**
 * Helper functions for subscription logic
 */

export function getAvailableSubscriptionActions(plan, currentSubscription, trialEligible = false) {
    const hasStripeTrial = plan?.trialDays > 0;
    const hasFlexibleTrial = plan?.flexibleTrial === true;
    const hasTrial = hasStripeTrial || hasFlexibleTrial;

    const hasActiveSubscription = currentSubscription?.status === "active";
    const isOnTrial = currentSubscription?.status === "trialing";
    const subscriptionExpired = currentSubscription?.status === "expired";
    const isFreePlan = plan?.key === "free";

    const canPayDirectly = !isFreePlan && (!hasActiveSubscription || subscriptionExpired);
    const canStartTrial = hasTrial && trialEligible && !isOnTrial && !hasActiveSubscription;

    let primaryAction = null;
    let primaryActionLabel = "";

    if (isFreePlan) {
        primaryAction = "select_free";
        primaryActionLabel = "اختر الباقة المجانية";
    } else if (canStartTrial) {
        primaryAction = "start_trial";
        primaryActionLabel = "ابدأ التجربة المجانية";
    } else if (canPayDirectly) {
        primaryAction = "pay";
        primaryActionLabel = "اشترك الآن";
    }

    let secondaryAction = null;
    let secondaryActionLabel = "";

    if (canStartTrial && canPayDirectly && !hasFlexibleTrial) {
        secondaryAction = "pay";
        secondaryActionLabel = "اشترك مباشرة";
    }

    return {
        canPayDirectly,
        canStartTrial,
        primaryAction,
        primaryActionLabel,
        secondaryAction,
        secondaryActionLabel,
        hasTrial,
        hasFlexibleTrial,
        hasActiveSubscription,
        isOnTrial,
        subscriptionExpired,
        isFreePlan,
    };
}

export function canUpgradeToPlan(targetPlan, currentSubscription) {
    if (!currentSubscription?.plan) return true;

    const tierOrder = { free: 0, pro: 1, enterprise: 2 };
    const currentKey = currentSubscription.plan?.key || "free";
    const targetKey = targetPlan?.key || "free";

    return (tierOrder[targetKey] || 0) > (tierOrder[currentKey] || 0);
}

export function getSubscriptionStatusMessage(subscription) {
    if (!subscription) return "لا يوجد اشتراك نشط";

    // Flexible trial
    if (subscription.status === "trialing" && subscription.trialStatus === "flexible") {
        return "تجربة مجانية (مدة مفتوحة)";
    }

    const messages = {
        trialing: "تجربة مجانية نشطة",
        active: "اشتراك نشط",
        expired: "انتهى الاشتراك",
        canceled: "تم إلغاء الاشتراك",
        past_due: "متأخر في الدفع",
    };

    return messages[subscription.status] || subscription.status;
}

export function hasFeatureAccess(subscription) {
    if (!subscription) return false;

    if (subscription.status === "active") return true;

    // Trialing - check type
    if (subscription.status === "trialing") {
        // Flexible trial - always has access (no end date)
        if (subscription.trialStatus === "flexible") return true;

        // Fixed trial - check end date
        if (subscription.trialEndDate) {
            return new Date() <= new Date(subscription.trialEndDate);
        }
    }

    return false;
}
