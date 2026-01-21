import {
    handleCheckoutCompleted,
    handleSubscriptionUpdated,
    handleSubscriptionDeleted,
    handlePaymentSucceeded,
    handlePaymentFailed,
    handleTrialWillEnd,
} from "./webhookHandlers";

/**
 * Stripe Webhook Router
 * 
 * Required events to enable in Stripe Dashboard:
 * - checkout.session.completed
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - customer.subscription.trial_will_end
 * - invoice.payment_succeeded
 * - invoice.payment_failed
 */
export async function handleWebhook(event) {
    switch (event.type) {
        // New subscription created via Checkout
        case "checkout.session.completed":
            await handleCheckoutCompleted(event.data.object);
            break;

        // Subscription created or updated (renewals, plan changes)
        case "customer.subscription.created":
        case "customer.subscription.updated":
            await handleSubscriptionUpdated(event.data.object);
            break;

        // Subscription canceled or expired
        case "customer.subscription.deleted":
            await handleSubscriptionDeleted(event.data.object);
            break;

        // Trial ending soon (3 days before expiration)
        case "customer.subscription.trial_will_end":
            await handleTrialWillEnd(event.data.object);
            break;

        // Payment succeeded (confirms renewal)
        case "invoice.payment_succeeded":
            await handlePaymentSucceeded(event.data.object);
            break;

        // Payment failed
        case "invoice.payment_failed":
            await handlePaymentFailed(event.data.object);
            break;

        default:
            break;
    }
}
