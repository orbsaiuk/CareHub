import { stripe } from "@/lib/stripe";

export async function createCheckoutSession({
    priceId,
    customerId,
    tenantType,
    tenantId,
    tenantName,
    successUrl,
    cancelUrl,
}) {
    try {
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            allow_promotion_codes: true,
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                tenantType,
                tenantId,
                tenantName,
            },
            subscription_data: {
                metadata: {
                    tenantType,
                    tenantId,
                    tenantName,
                },
            },
        });

        return session;
    } catch (error) {
        throw error;
    }
}

export async function createTrialCheckoutSession({
    priceId,
    customerId,
    tenantType,
    tenantId,
    tenantName,
    trialPeriodDays,
    planId,
    successUrl,
    cancelUrl,
}) {
    try {
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            allow_promotion_codes: true,
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                tenantType,
                tenantId,
                tenantName,
                isTrial: "true",
                planId,
            },
            subscription_data: {
                trial_period_days: trialPeriodDays,
                metadata: {
                    tenantType,
                    tenantId,
                    tenantName,
                    isTrial: "true",
                    planId,
                },
            },
        });

        return session;
    } catch (error) {
        throw error;
    }
}

export async function convertTrialSubscription(
    stripeSubscriptionId,
    paymentMethodId
) {
    try {
        await stripe.subscriptions.retrieve(
            stripeSubscriptionId
        );

        const updatedSubscription = await stripe.subscriptions.update(
            stripeSubscriptionId,
            {
                trial_end: "now",
                default_payment_method: paymentMethodId,
                proration_behavior: "none",
            }
        );

        return updatedSubscription;
    } catch (error) {
        throw error;
    }
}

export async function createBillingPortalSession(customerId, returnUrl) {
    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        });
        return session;
    } catch (error) {
        if (
            error.code === "invalid_request_error" &&
            error.message.includes("No configuration provided")
        ) {
            const configuration = await stripe.billingPortal.configurations.create({
                business_profile: {
                    headline: "Manage your subscription and billing details",
                },
                features: {
                    payment_method_update: { enabled: true },
                    invoice_history: { enabled: true },
                    customer_update: {
                        enabled: true,
                        allowed_updates: ["email", "address"],
                    },
                    subscription_cancel: { enabled: true },
                },
            });

            const session = await stripe.billingPortal.sessions.create({
                customer: customerId,
                return_url: returnUrl,
                configuration: configuration.id,
            });

            return session;
        }

        throw error;
    }
}
