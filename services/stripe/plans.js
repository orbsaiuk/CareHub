import { stripe } from "@/lib/stripe";
import { getAllPlans, updatePlan } from "@/services/sanity/subscriptions";

export async function syncPlansToStripe() {
    try {
        const plans = await getAllPlans();

        for (const plan of plans) {
            let product;
            if (plan.stripeProductId) {
                try {
                    product = await stripe.products.retrieve(plan.stripeProductId);
                    await stripe.products.update(plan.stripeProductId, {
                        name: plan.name,
                        description: plan.description,
                        metadata: { sanityPlanId: plan._id },
                    });
                } catch (error) {
                    if (error.code === "resource_missing") {
                        product = null;
                    } else {
                        throw error;
                    }
                }
            }

            if (!product) {
                product = await stripe.products.create({
                    name: plan.name,
                    description: plan.description,
                    metadata: { sanityPlanId: plan._id },
                });

                await updatePlan(plan._id, {
                    stripeProductId: product.id,
                });
            }

            if (!plan.stripePriceId && plan.price?.amount > 0) {
                const price = await stripe.prices.create({
                    product: product.id,
                    unit_amount: Math.round(plan.price.amount * 100),
                    currency: plan.price.currency || "gbp",
                    recurring: {
                        interval: plan.price.interval,
                    },
                    metadata: { sanityPlanId: plan._id },
                });

                await updatePlan(plan._id, {
                    stripePriceId: price.id,
                });
            }
        }
    } catch (error) {
        throw error;
    }
}
