import { sendEmail } from "@/lib/email";
import {
    buildTrialWelcomeEmail,
    buildTrialReminderEmail,
    buildTrialExpiredEmail,
    buildFlexibleTrialWelcomeEmail,
    buildFlexibleTrialConvertedEmail,
} from "@/lib/email/trialTemplates";
import { getPlanById } from "@/services/sanity/subscriptions";
import { writeClient } from "@/sanity/lib/serverClient";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Get email address for a tenant
 */
async function getTenantEmail(tenantType, tenantId) {
    try {
        const query = `*[_type == $tenantType && tenantId == $tenantId][0]{
      "email": contact.email,
      "clerkId": clerkId
    }`;

        const tenant = await writeClient.fetch(query, { tenantType, tenantId });
        if (!tenant) return null;

        if (tenant.email) return tenant.email;

        if (tenant.clerkId) {
            try {
                const user = await clerkClient.users.getUser(tenant.clerkId);
                return user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
            } catch {
                return null;
            }
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Send trial welcome email
 */
export async function sendTrialWelcomeEmail(subscription) {
    try {
        const email = await getTenantEmail(subscription.tenantType, subscription.tenantId);
        if (!email) return { ok: false, reason: "No email address found" };

        const plan = await getPlanById(subscription.plan._ref);
        if (!plan) return { ok: false, reason: "Plan not found" };

        const { subject, html } = buildTrialWelcomeEmail(subscription, plan);
        const result = await sendEmail({ to: email, subject, html });

        return result.ok ? { ok: true } : { ok: false, error: result.error };
    } catch (error) {
        return { ok: false, error: String(error) };
    }
}

/**
 * Send trial reminder email (called by Stripe webhook)
 */
export async function sendTrialReminderEmail(subscription, daysRemaining) {
    try {
        const email = await getTenantEmail(subscription.tenantType, subscription.tenantId);
        if (!email) return { ok: false, reason: "No email address found" };

        const planId = subscription.plan?._ref || subscription.plan?._id;
        if (!planId) return { ok: false, reason: "No plan ID found" };

        const plan = await getPlanById(planId);
        if (!plan) return { ok: false, reason: "Plan not found" };

        const { subject, html } = buildTrialReminderEmail(subscription, plan, daysRemaining);
        const result = await sendEmail({ to: email, subject, html });

        return result.ok ? { ok: true } : { ok: false, error: result.error };
    } catch (error) {
        return { ok: false, error: String(error) };
    }
}

/**
 * Send trial expired email
 */
export async function sendTrialExpiredEmail(subscription) {
    try {
        const email = await getTenantEmail(subscription.tenantType, subscription.tenantId);
        if (!email) return { ok: false, reason: "No email address found" };

        const planId = subscription.plan?._ref || subscription.plan?._id;
        if (!planId) return { ok: false, reason: "No plan ID found" };

        const plan = await getPlanById(planId);
        if (!plan) return { ok: false, reason: "Plan not found" };

        const { subject, html } = buildTrialExpiredEmail(subscription, plan);
        const result = await sendEmail({ to: email, subject, html });

        return result.ok ? { ok: true } : { ok: false, error: result.error };
    } catch (error) {
        return { ok: false, error: String(error) };
    }
}

/**
 * Send flexible trial welcome email (no end date)
 */
export async function sendFlexibleTrialWelcomeEmail(subscription) {
    try {
        const email = await getTenantEmail(subscription.tenantType, subscription.tenantId);
        if (!email) return { ok: false, reason: "No email address found" };

        const planId = subscription.plan?._ref || subscription.plan?._id;
        if (!planId) return { ok: false, reason: "No plan ID found" };

        const plan = await getPlanById(planId);
        if (!plan) return { ok: false, reason: "Plan not found" };

        const { subject, html } = buildFlexibleTrialWelcomeEmail(subscription, plan);
        const result = await sendEmail({ to: email, subject, html });

        return result.ok ? { ok: true } : { ok: false, error: result.error };
    } catch (error) {
        return { ok: false, error: String(error) };
    }
}

/**
 * Send flexible trial converted to free plan email
 */
export async function sendFlexibleTrialConvertedEmail(subscription) {
    try {
        const email = await getTenantEmail(subscription.tenantType, subscription.tenantId);
        if (!email) return { ok: false, reason: "No email address found" };

        // Get the free plan
        const freePlan = await writeClient.fetch(
            `*[_type == "plan" && key == "free"][0]{ _id, name }`
        );
        if (!freePlan) return { ok: false, reason: "Free plan not found" };

        const { subject, html } = buildFlexibleTrialConvertedEmail(subscription, freePlan);
        const result = await sendEmail({ to: email, subject, html });

        return result.ok ? { ok: true } : { ok: false, error: result.error };
    } catch (error) {
        return { ok: false, error: String(error) };
    }
}
