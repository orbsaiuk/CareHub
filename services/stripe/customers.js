import { stripe } from "@/lib/stripe";

export async function createCustomer({ email, name, tenantType, tenantId }) {
    try {
        const customer = await stripe.customers.create({
            email,
            name,
            metadata: {
                tenantType,
                tenantId,
            },
        });
        return customer;
    } catch (error) {
        throw error;
    }
}

export async function getOrCreateCustomer({
    email,
    name,
    tenantType,
    tenantId,
}) {
    try {
        const existingCustomers = await stripe.customers.list({
            limit: 1,
            email: email,
        });

        if (existingCustomers.data.length > 0) {
            const customer = existingCustomers.data[0];
            if (customer.metadata.tenantId !== tenantId) {
                await stripe.customers.update(customer.id, {
                    metadata: { tenantType, tenantId },
                });
            }
            return customer;
        }

        return await createCustomer({ email, name, tenantType, tenantId });
    } catch (error) {
        throw error;
    }
}
