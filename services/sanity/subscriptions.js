import { writeClient } from "@/sanity/lib/serverClient";
import { client as readClient } from "@/sanity/lib/client";
import {
  ALL_PLANS_QUERY,
  PLAN_BY_SLUG_QUERY,
  PLAN_BY_ID_QUERY,
  SUBSCRIPTION_BY_TENANT_QUERY,
  ALL_SUBSCRIPTIONS_BY_TENANT_QUERY,
  SUBSCRIPTION_BY_ID_QUERY,
  SUBSCRIPTION_USAGE_QUERY,
  PRICING_PLANS_QUERY,
  PLAN_BY_STRIPE_PRICE_ID_QUERY,
  TENANT_DOC_ID_BY_TYPE_AND_TENANT_ID_QUERY,
  SUBSCRIPTION_BY_STRIPE_SUBSCRIPTION_ID_QUERY,
} from "@/sanity/queries/subscriptions";

// Plan queries
export async function getAllPlans() {
  try {
    return await readClient.fetch(ALL_PLANS_QUERY);
  } catch (error) {
    return [];
  }
}

export async function getPlanBySlug(slug) {
  try {
    return await readClient.fetch(PLAN_BY_SLUG_QUERY, { slug });
  } catch (error) {
    return null;
  }
}

export async function getPlanById(planId) {
  try {
    return await readClient.fetch(PLAN_BY_ID_QUERY, { planId });
  } catch (error) {
    return null;
  }
}

export async function getPlanByStripePriceId(priceId) {
  try {
    return await readClient.fetch(PLAN_BY_STRIPE_PRICE_ID_QUERY, { priceId });
  } catch (error) {
    return null;
  }
}

export async function getPricingPlans() {
  try {
    return await readClient.fetch(PRICING_PLANS_QUERY);
  } catch (error) {
    return [];
  }
}

// Update plan (for Stripe sync)
export async function updatePlan(planId, updates) {
  try {
    return await writeClient
      .patch(planId)
      .set({ ...updates, _updatedAt: new Date().toISOString() })
      .commit();
  } catch (error) {
    throw error;
  }
}

// Subscription queries
export async function getCurrentSubscription(tenantType, tenantId) {
  try {
    return await writeClient.fetch(SUBSCRIPTION_BY_TENANT_QUERY, {
      tenantType,
      tenantId,
    });
  } catch (error) {
    return null;
  }
}

export async function getAllSubscriptions(tenantType, tenantId) {
  try {
    return await writeClient.fetch(ALL_SUBSCRIPTIONS_BY_TENANT_QUERY, { tenantType, tenantId });
  } catch (error) {
    return [];
  }
}

export async function getSubscriptionById(subscriptionId) {
  try {
    return await writeClient.fetch(SUBSCRIPTION_BY_ID_QUERY, { subscriptionId });
  } catch (error) {
    return null;
  }
}

export async function getSubscriptionByStripeId(stripeSubscriptionId) {
  try {
    return await writeClient.fetch(SUBSCRIPTION_BY_STRIPE_SUBSCRIPTION_ID_QUERY, { stripeSubscriptionId });
  } catch (error) {
    return null;
  }
}

export async function createSubscription(subscriptionData) {
  try {
    let tenantRef = undefined;

    if (subscriptionData.tenantType && subscriptionData.tenantId) {
      const tenantDocId = await writeClient.fetch(
        TENANT_DOC_ID_BY_TYPE_AND_TENANT_ID_QUERY,
        { tenantType: subscriptionData.tenantType, tenantId: subscriptionData.tenantId }
      );
      if (tenantDocId) {
        tenantRef = { _type: "reference", _ref: tenantDocId };
      }
    }

    const subscription = await writeClient.create({
      _type: "subscription",
      ...subscriptionData,
      tenant: tenantRef,
      startDate: subscriptionData.startDate || new Date().toISOString(),
      usage: subscriptionData.usage || { blogPosts: 0 },
    });

    await updateTenantSubscription(
      subscriptionData.tenantType,
      subscriptionData.tenantId,
      subscription._id
    );

    return subscription;
  } catch (error) {
    throw error;
  }
}

export async function updateSubscription(subscriptionId, updates) {
  try {
    return await writeClient
      .patch(subscriptionId)
      .set({ ...updates, _updatedAt: new Date().toISOString() })
      .commit();
  } catch (error) {
    throw error;
  }
}

export async function cancelSubscription(subscriptionId) {
  try {
    return await updateSubscription(subscriptionId, {
      status: "canceled",
      endDate: new Date().toISOString(),
    });
  } catch (error) {
    throw error;
  }
}

// Usage tracking
export async function getSubscriptionUsage(tenantType, tenantId) {
  try {
    return await writeClient.fetch(SUBSCRIPTION_USAGE_QUERY, { tenantType, tenantId });
  } catch (error) {
    return null;
  }
}

export async function incrementUsage(tenantType, tenantId, usageType, increment = 1) {
  try {
    const subscription = await getCurrentSubscription(tenantType, tenantId);
    if (!subscription) throw new Error("No active subscription found");

    const currentUsage = subscription.usage || {};
    const newUsage = {
      ...currentUsage,
      [usageType]: (currentUsage[usageType] || 0) + increment,
    };

    return await updateSubscription(subscription._id, { usage: newUsage });
  } catch (error) {
    throw error;
  }
}

export async function checkUsageLimit(tenantType, tenantId, usageType) {
  try {
    const subscription = await getCurrentSubscription(tenantType, tenantId);
    if (!subscription) {
      return { allowed: false, reason: "No active subscription" };
    }

    if (subscription.status === "expired") {
      return { allowed: false, reason: "Subscription expired", expired: true };
    }

    const limits = subscription.plan?.limits || {};
    const usage = subscription.usage || {};
    const limit = limits[usageType];
    const current = usage[usageType] || 0;

    if (limit === -1) {
      return { allowed: true, current, limit: "unlimited" };
    }

    return {
      allowed: current < limit,
      current,
      limit,
      remaining: Math.max(0, limit - current),
    };
  } catch (error) {
    return { allowed: false, reason: "Error checking limits" };
  }
}

// Payment
export async function createPayment(paymentData) {
  try {
    return await writeClient.create({
      _type: "payment",
      ...paymentData,
      transactionDate: paymentData.transactionDate || new Date().toISOString(),
    });
  } catch (error) {
    throw error;
  }
}

export async function getPaymentsByStripeInvoiceId(stripeInvoiceId) {
  try {
    return await writeClient.fetch(
      `*[_type == "payment" && stripeInvoiceId == $stripeInvoiceId]`,
      { stripeInvoiceId }
    );
  } catch (error) {
    return [];
  }
}

// Tenant subscription helpers
export async function updateTenantSubscription(tenantType, tenantId, subscriptionId) {
  try {
    const tenantDocId = await writeClient.fetch(
      TENANT_DOC_ID_BY_TYPE_AND_TENANT_ID_QUERY,
      { tenantType, tenantId }
    );

    if (!tenantDocId) {
      throw new Error(`${tenantType} with tenantId ${tenantId} not found`);
    }

    return await writeClient
      .patch(tenantDocId)
      .set({ subscription: { _type: "reference", _ref: subscriptionId } })
      .commit();
  } catch (error) {
    throw error;
  }
}

export async function clearTenantSubscription(tenantType, tenantId) {
  try {
    const tenantDocId = await writeClient.fetch(
      TENANT_DOC_ID_BY_TYPE_AND_TENANT_ID_QUERY,
      { tenantType, tenantId }
    );

    if (!tenantDocId) return null;

    return await writeClient.patch(tenantDocId).unset(["subscription"]).commit();
  } catch (error) {
    console.error("Failed to clear tenant subscription:", error);
    throw error;
  }
}

// Feature access checks
export async function checkPlanFeature(tenantType, tenantId, featureName) {
  try {
    const subscription = await getCurrentSubscription(tenantType, tenantId);
    if (!subscription) {
      return { allowed: false, reason: "No active subscription" };
    }

    const limits = subscription.plan?.limits || {};
    const featureValue = limits[featureName];

    if (typeof featureValue === "boolean") {
      return { allowed: featureValue };
    }

    if (typeof featureValue === "number") {
      if (featureValue === -1) return { allowed: true, limit: "unlimited" };
      return { allowed: featureValue > 0, limit: featureValue };
    }

    return { allowed: false, reason: "Feature not defined in plan" };
  } catch (error) {
    return { allowed: false, reason: "Error checking feature" };
  }
}

export async function getTenantPlanFeatures(tenantType, tenantId) {
  try {
    const subscription = await getCurrentSubscription(tenantType, tenantId);
    if (!subscription) {
      return { hasSubscription: false, isPaidPlan: false, blogPostsLimit: 0 };
    }

    const limits = subscription.plan?.limits || {};
    const isFreePlan = subscription.plan?.key === "free";

    return {
      hasSubscription: true,
      isPaidPlan: !isFreePlan,
      planKey: subscription.plan?.key,
      planName: subscription.plan?.name,
      planSlug: subscription.plan?.slug,
      blogPostsLimit: limits.blogPosts ?? 0,
    };
  } catch (error) {
    return { hasSubscription: false, isPaidPlan: false, blogPostsLimit: 0 };
  }
}

export async function canCreateBlogPost(tenantType, tenantId) {
  try {
    const subscription = await getCurrentSubscription(tenantType, tenantId);

    if (!subscription) {
      return {
        allowed: false,
        reason: "يجب الاشتراك في باقة مدفوعة للوصول إلى ميزة المدونة",
        requiresUpgrade: true,
      };
    }

    if (subscription.plan?.key === "free") {
      return {
        allowed: false,
        reason: "ميزة المدونة متاحة فقط للباقات المدفوعة",
        requiresUpgrade: true,
      };
    }

    return await checkUsageLimit(tenantType, tenantId, "blogPosts");
  } catch (error) {
    return { allowed: false, reason: "Error checking blog post limit" };
  }
}


// Flexible trial (Sanity-only, no Stripe)
export async function createFlexibleTrial(tenantType, tenantId, tenantName, planId) {
  try {
    const subscription = await createSubscription({
      tenantType,
      tenantId,
      tenantName,
      plan: { _type: "reference", _ref: planId },
      status: "trialing",
      trialStatus: "flexible",
      trialEndDate: null, // Unknown duration
      startDate: new Date().toISOString(),
    });

    return subscription;
  } catch (error) {
    throw error;
  }
}

// End flexible trial (admin action)
export async function endFlexibleTrial(subscriptionId, convertToPaid = false) {
  try {
    const updates = convertToPaid
      ? { status: "active", trialStatus: "converted" }
      : { status: "expired", trialStatus: "expired" };

    return await updateSubscription(subscriptionId, updates);
  } catch (error) {
    throw error;
  }
}

// Convert all flexible trial subscriptions to free plan
export async function convertFlexibleTrialsToFree(planId) {
  try {
    const freePlan = await writeClient.fetch(
      `*[_type == "plan" && key == "free"][0]{ _id, name }`
    );

    if (!freePlan) {
      throw new Error("Free plan not found");
    }

    const flexibleTrialSubs = await writeClient.fetch(
      `*[_type == "subscription" && status == "trialing" && trialStatus == "flexible" && plan._ref == $planId]{
        _id,
        tenantType,
        tenantId,
        tenantName
      }`,
      { planId }
    );

    if (!flexibleTrialSubs.length) {
      return { converted: 0, subscriptions: [] };
    }

    const results = [];
    for (const sub of flexibleTrialSubs) {
      try {
        await writeClient
          .patch(sub._id)
          .set({
            plan: { _type: "reference", _ref: freePlan._id },
            status: "active",
            trialStatus: "converted_to_free",
            trialEndDate: new Date().toISOString(),
            _updatedAt: new Date().toISOString(),
          })
          .commit();

        results.push({
          subscriptionId: sub._id,
          tenantType: sub.tenantType,
          tenantId: sub.tenantId,
          tenantName: sub.tenantName,
        });
      } catch {
        // Skip failed patches
      }
    }

    return { converted: results.length, subscriptions: results };
  } catch (error) {
    throw error;
  }
}

// Get count of flexible trial subscriptions for a plan
export async function getFlexibleTrialCount(planId) {
  try {
    return await writeClient.fetch(
      `count(*[_type == "subscription" && status == "trialing" && trialStatus == "flexible" && plan._ref == $planId])`,
      { planId }
    );
  } catch {
    return 0;
  }
}
