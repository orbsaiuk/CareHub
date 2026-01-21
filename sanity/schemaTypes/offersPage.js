import { defineField, defineType } from "sanity";

export default defineType({
    name: "offersPage",
    title: "Studio Offers",
    type: "document",
    initialValue: async (_props, context) => {
        // This runs when the document is loaded
        const { documentId } = context;
        if (!documentId) return {};

        const client = context.getClient({ apiVersion: '2023-01-01' });
        const doc = await client.fetch(`*[_id == $id][0]`, { id: documentId });

        if (doc?.products?.length > 0) {
            const productIds = doc.products.map(p => p._ref).filter(Boolean);
            const query = `*[_type == "product" && _id in $productIds && hasOffer != true]._id`;
            const invalidProductIds = await client.fetch(query, { productIds });

            if (invalidProductIds.length > 0) {
                const validProducts = doc.products.filter(
                    p => !invalidProductIds.includes(p._ref)
                );

                // Auto-update the document
                await client
                    .patch(documentId)
                    .set({ products: validProducts })
                    .commit();

                return { ...doc, products: validProducts };
            }
        }

        return doc || {};
    },
    fields: [
        defineField({
            name: "tenantType",
            title: "Tenant Type",
            type: "string",
            description: "Whether this offer belongs to a company or supplier",
            validation: (Rule) => Rule.required().valid("company", "supplier"),
            initialValue: "company",
        }),
        defineField({
            name: "company",
            title: "Company",
            type: "reference",
            to: [{ type: "company" }],
            description: "Select the company for this offer",
            hidden: ({ document }) => document?.tenantType !== "company",
            validation: (Rule) =>
                Rule.custom((company, context) => {
                    const tenantType = context.document?.tenantType;
                    if (tenantType === "company" && !company) {
                        return "Company is required when tenant type is company";
                    }
                    return true;
                }),
        }),
        defineField({
            name: "supplier",
            title: "Supplier",
            type: "reference",
            to: [{ type: "supplier" }],
            description: "Select the supplier for this offer",
            hidden: ({ document }) => document?.tenantType !== "supplier",
            validation: (Rule) =>
                Rule.custom((supplier, context) => {
                    const tenantType = context.document?.tenantType;
                    if (tenantType === "supplier" && !supplier) {
                        return "Supplier is required when tenant type is supplier";
                    }
                    return true;
                }),
        }),
        defineField({
            name: "products",
            title: "Products",
            type: "array",
            of: [
                {
                    type: "reference",
                    to: [{ type: "product" }],
                    options: {
                        filter: ({ document }) => {
                            const tenantType = document?.tenantType;
                            const companyRef = document?.company?._ref;
                            const supplierRef = document?.supplier?._ref;

                            // If company is selected, filter by company reference
                            if (tenantType === "company" && companyRef) {
                                return {
                                    filter: "_type == 'product' && tenantType == 'company' && hasOffer == true && references($companyRef)",
                                    params: { companyRef },
                                };
                            }

                            // If supplier is selected, filter by supplier reference
                            if (tenantType === "supplier" && supplierRef) {
                                return {
                                    filter: "_type == 'product' && tenantType == 'supplier' && hasOffer == true && references($supplierRef)",
                                    params: { supplierRef },
                                };
                            }

                            // Default: filter by tenant type only
                            if (tenantType) {
                                return {
                                    filter: "_type == 'product' && tenantType == $tenantType && hasOffer == true",
                                    params: { tenantType },
                                };
                            }

                            // Fallback: show all products with offers
                            return {
                                filter: "_type == 'product' && hasOffer == true",
                            };
                        },
                    },
                },
            ],
            description: "Select products with active offers from the selected company/supplier",
            validation: (Rule) =>
                Rule.required()
                    .min(1)
                    .error("At least one product is required")
                    .custom(async (products, context) => {
                        if (!products || products.length === 0) return true;

                        const client = context.getClient({ apiVersion: '2023-01-01' });
                        const productIds = products.map(p => p._ref).filter(Boolean);

                        if (productIds.length === 0) return true;

                        const query = `*[_type == "product" && _id in $productIds && hasOffer != true]._id`;
                        const invalidProducts = await client.fetch(query, { productIds });

                        if (invalidProducts.length > 0) {
                            return `Cannot add products without active offers. Remove products that don't have "hasOffer" enabled.`;
                        }

                        return true;
                    }),
        }),
        defineField({
            name: "isPromoted",
            title: "Promote to Public Page",
            type: "boolean",
            initialValue: false,
            description: "Toggle to show/hide this offer on the public offers page",
        }),
        defineField({
            name: "startDate",
            title: "Start Date",
            type: "date",
            options: { dateFormat: "YYYY-MM-DD" },
        }),
        defineField({
            name: "endDate",
            title: "End Date",
            type: "date",
            options: { dateFormat: "YYYY-MM-DD" },
            validation: (Rule) =>
                Rule.custom((end, context) => {
                    const start = context.parent?.startDate;

                    if (!start) return true;
                    if (!end) return "End Date is required when Start Date is selected";
                    if (end < start) return "End Date cannot be before Start Date";

                    return true;
                }),
        }),
        defineField({
            name: "status",
            title: "Status",
            type: "string",
            initialValue: "active",
            options: {
                list: [
                    { title: "Active", value: "active" },
                    { title: "Inactive", value: "inactive" },
                    { title: "Expired", value: "expired" },
                ],
                layout: "radio",
            },
        }),
    ],
    preview: {
        select: {
            companyName: "company.name",
            supplierName: "supplier.name",
            isPromoted: "isPromoted",
            status: "status",
        },
        prepare({ companyName, supplierName, isPromoted, status }) {
            const tenantName = companyName || supplierName || "No tenant";
            return {
                title: `${tenantName} Product's offers`,
                subtitle: `${tenantName} | ${isPromoted ? "🌟 Promoted" : "Not Promoted"} | ${status}`,
            };
        },
    },
});
