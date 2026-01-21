import { stripe } from "@/lib/stripe";
import {
    getPlanByStripePriceId,
    createSubscription,
    getSubscriptionByStripeId,
    updateSubscription,
    createPayment,
    getPaymentsByStripeInvoiceId,
    getCurrentSubscription,
} from "@/services/sanity/subscriptions";

/**
 * Stripe Webhook Handlers
 * 
 * Trial lifecycle: active → converted (on payment) → paid
 * endDate updates ONLY after payment succeeds
 */

// Helper: Convert Unix timestamp to ISO string safely
function toISO(timestamp) {
    if (!timestamp || typeof timestamp !== "number") return null;
    try {
        return new Date(timestamp * 1000).toISOString();
    } catch {
        return null;
    }
}

// Helper: Extract subscription ID from invoice (Stripe API v2025+)
function getSubscriptionIdFromInvoice(invoice) {
    return invoice.subscription
        || invoice.parent?.subscription_details?.subscription
        || invoice.lines?.data?.[0]?.parent?.subscription_item_details?.subscription;
}

// Helper: Extract tenant metadata from subscription or invoice
function getTenantMeta(subscription, invoice) {
    const subMeta = subscription?.metadata || {};
    const invMeta = invoice?.parent?.subscription_details?.metadata
        || invoice?.lines?.data?.[0]?.metadata || {};
    return {
        tenantType: subMeta.tenantType || invMeta.tenantType,
        tenantId: subMeta.tenantId || invMeta.tenantId,
    };
}

// checkout.session.completed - Create subscription in Sanity
export async function handleCheckoutCompleted(session) {
    const { tenantType, tenantId, tenantName } = session.metadata || {};
    if (!session.subscription || !tenantType || !tenantId) return;

    const sub = await stripe.subscriptions.retrieve(session.subscription);

    // Idempotency check
    if (await getSubscriptionByStripeId(sub.id)) return;

    const plan = await getPlanByStripePriceId(sub.items.data[0].price.id);
    if (!plan) return;

    // Cancel any existing Stripe subscriptions for this tenant (plan change)
    const existingSub = await getCurrentSubscription(tenantType, tenantId);
    if (existingSub?.stripeSubscriptionId && existingSub.stripeSubscriptionId !== sub.id) {
        try {
            await stripe.subscriptions.cancel(existingSub.stripeSubscriptionId);
            await updateSubscription(existingSub._id, {
                status: "canceled",
                endDate: new Date().toISOString(),
                ...(existingSub.trialStatus === "active" && { trialStatus: "expired" }),
            });
        } catch { }
    }

    const data = {
        tenantType,
        tenantId,
        tenantName,
        plan: { _type: "reference", _ref: plan._id },
        stripeSubscriptionId: sub.id,
        stripeCustomerId: session.customer,
        status: sub.status,
        startDate: toISO(sub.current_period_start) || new Date().toISOString(),
    };

    // Only set endDate for non-trial subscriptions (trial end ≠ billing end)
    if (!sub.trial_end) {
        data.endDate = toISO(sub.current_period_end);
    }

    if (sub.trial_end) {
        data.trialEndDate = toISO(sub.trial_end);
        data.trialStatus = "active";
    }

    const result = await createSubscription(data);

    // Send welcome email based on subscription type
    if (result) {
        try {
            if (sub.trial_end) {
                // Trial subscription - send trial welcome email
                const { sendTrialWelcomeEmail } = await import("@/services/email/trialNotifications");
                await sendTrialWelcomeEmail({ ...result, plan: { _ref: plan._id } });
            } else {
                // Non-trial subscription - send paid subscription welcome email
                const { sendPaidSubscriptionWelcomeEmail } = await import("@/services/email/subscriptionNotifications");
                await sendPaidSubscriptionWelcomeEmail({ ...result, plan: { _ref: plan._id } }, plan);
            }
        } catch { }
    }
}

// customer.subscription.updated
export async function handleSubscriptionUpdated(subscription) {
    const existing = await getSubscriptionByStripeId(subscription.id);
    if (!existing) return;

    const plan = await getPlanByStripePriceId(subscription.items.data[0].price.id);

    const trialExpired =
        subscription.trial_end && subscription.trial_end * 1000 < Date.now();

    const inactiveStatuses = [
        "past_due",
        "unpaid",
        "canceled",
        "incomplete_expired",
        "incomplete",
    ];

    const update = { status: subscription.status };

    if (plan?._id) {
        update.plan = { _type: "reference", _ref: plan._id };
    }

    // Handle cancel_at_period_end (user cancelled from billing portal)
    // Keep status "active" so user retains access until period ends
    if (subscription.cancel_at_period_end && !existing.cancelAtPeriodEnd) {
        update.cancelAtPeriodEnd = true;
        if (subscription.cancel_at) {
            update.endDate = toISO(subscription.cancel_at);
        }

        // Send cancellation email when user cancels (but still has access)
        try {
            const { sendSubscriptionCancelledEmail } = await import("@/services/email/subscriptionNotifications");
            await sendSubscriptionCancelledEmail(existing);
        } catch { }
    } else if (existing.cancelAtPeriodEnd && !subscription.cancel_at_period_end) {
        // User reactivated subscription
        update.cancelAtPeriodEnd = false;
    }

    // ✅ Trial handling
    if (existing.trialStatus === "active") {
        // Trial → converted (NO payment yet, just Stripe state flip)
        if (
            subscription.status === "active" &&
            trialExpired &&
            !existing.convertedFromTrial
        ) {
            update.trialStatus = "converted";
            update.convertedFromTrial = true;
            update.trialConversionDate = new Date().toISOString();
        }

        // Trial expired without payment
        if (
            trialExpired &&
            inactiveStatuses.includes(subscription.status)
        ) {
            update.trialStatus = "expired";
            update.status = "expired";

            // Send trial expired email
            try {
                const { sendTrialExpiredEmail } = await import("@/services/email/trialNotifications");
                await sendTrialExpiredEmail(existing);
            } catch { }
        }
    }

    await updateSubscription(existing._id, update);
}


// customer.subscription.deleted - Handle deletion
export async function handleSubscriptionDeleted(subscription) {
    const existing = await getSubscriptionByStripeId(subscription.id);
    if (!existing) return;

    const update = {
        status: "canceled",
        endDate: new Date().toISOString(),
    };

    if (existing.trialStatus === "active") {
        update.trialStatus = "expired";
    }

    await updateSubscription(existing._id, update);

    // Send deletion email (subscription permanently ended)
    try {
        const { sendSubscriptionDeletedEmail } = await import("@/services/email/subscriptionNotifications");
        await sendSubscriptionDeletedEmail(existing);
    } catch { }
}

// invoice.payment_succeeded - Update endDate & record payment
export async function handlePaymentSucceeded(invoice) {
    const subscriptionId = getSubscriptionIdFromInvoice(invoice);
    if (!subscriptionId) return;

    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    if (!sub) return;

    const { tenantType, tenantId } = getTenantMeta(sub, invoice);
    if (!tenantType || !tenantId) return;

    const existing = await getSubscriptionByStripeId(sub.id);
    if (!existing) return;

    // Idempotency check
    const existingPayments = await getPaymentsByStripeInvoiceId?.(invoice.id);
    if (existingPayments?.length > 0) return;

    // Check if this is a renewal (not first payment)
    const isRenewal = existing.startDate && !existing.trialStatus;

    // Update subscription with new billing period
    const update = { status: "active" };
    const startDate = toISO(sub.current_period_start);
    const endDate = toISO(sub.current_period_end);

    if (startDate) update.startDate = startDate;
    if (endDate) update.endDate = endDate;

    // Mark trial as converted on first payment (only if still active, prevent double writes)
    const isTrialConversion = existing.trialStatus === "active" && !existing.convertedFromTrial;
    if (isTrialConversion) {
        update.trialStatus = "converted";
        update.convertedFromTrial = true;
        update.trialConversionDate = new Date().toISOString();
    }

    await updateSubscription(existing._id, update);

    // Record payment
    const paymentData = {
        subscription: { _type: "reference", _ref: existing._id },
        tenantType,
        tenantId,
        amount: {
            total: invoice.amount_paid / 100,
            currency: invoice.currency,
            tax: (invoice.tax || 0) / 100,
            discount: (invoice.discount?.amount || 0) / 100,
        },
        status: "succeeded",
        stripePaymentId: invoice.payment_intent,
        stripeInvoiceId: invoice.id,
        transactionDate: toISO(invoice.created) || new Date().toISOString(),
        paymentMethod: { type: "card" },
    };

    await createPayment(paymentData);

    // Send renewal email (only for renewals, not first payment or trial conversion)
    if (isRenewal && !isTrialConversion) {
        try {
            const { sendSubscriptionRenewedEmail } = await import("@/services/email/subscriptionNotifications");
            await sendSubscriptionRenewedEmail({ ...existing, ...update }, paymentData);
        } catch { }
    }
}

// invoice.payment_failed - Record failed payment
export async function handlePaymentFailed(invoice) {
    const subscriptionId = getSubscriptionIdFromInvoice(invoice);
    if (!subscriptionId) return;

    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    if (!sub) return;

    const { tenantType, tenantId } = getTenantMeta(sub, invoice);
    if (!tenantType || !tenantId) return;

    const existing = await getSubscriptionByStripeId(sub.id);
    if (!existing) return;

    // Idempotency check
    const existingPayments = await getPaymentsByStripeInvoiceId?.(invoice.id);
    if (existingPayments?.length > 0) return;

    await createPayment({
        subscription: { _type: "reference", _ref: existing._id },
        tenantType,
        tenantId,
        amount: {
            total: invoice.amount_due / 100,
            currency: invoice.currency,
            tax: (invoice.tax || 0) / 100,
            discount: 0,
        },
        status: "failed",
        stripePaymentId: invoice.payment_intent,
        stripeInvoiceId: invoice.id,
        transactionDate: toISO(invoice.created) || new Date().toISOString(),
        paymentMethod: { type: "card" },
    });
}

// customer.subscription.trial_will_end - Send reminder email
export async function handleTrialWillEnd(subscription) {
    const existing = await getSubscriptionByStripeId(subscription.id);
    if (!existing || existing.trialStatus !== "active") return;

    const daysRemaining = Math.ceil(
        (subscription.trial_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24)
    );

    try {
        const { sendTrialReminderEmail } = await import("@/services/email/trialNotifications");
        await sendTrialReminderEmail(existing, daysRemaining);
    } catch { }
}
