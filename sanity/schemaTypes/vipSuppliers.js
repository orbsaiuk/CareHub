import { defineField, defineType } from "sanity";

export default defineType({
    name: "vipSuppliers",
    title: "VIP Suppliers",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            initialValue: "VIP Suppliers",
            readOnly: true,
            hidden: true,
        }),
        defineField({
            name: "suppliers",
            title: "VIP Suppliers",
            description: "Select suppliers to display at the top of search results",
            type: "array",
            of: [
                {
                    type: "reference",
                    to: [{ type: "supplier" }],
                },
            ],
            validation: (Rule) => Rule.unique(),
        }),
        defineField({
            name: "products",
            title: "VIP Supplier Products",
            description: "Select supplier products to display at the top of search results",
            type: "array",
            of: [
                {
                    type: "reference",
                    to: [{ type: "product" }],
                    options: {
                        filter: 'tenantType == "supplier"',
                    },
                },
            ],
            validation: (Rule) => Rule.unique(),
        }),
    ],
    preview: {
        select: {
            suppliers: "suppliers",
        },
        prepare({ suppliers }) {
            const count = suppliers?.length || 0;
            return {
                title: "VIP Suppliers",
                subtitle: `${count} ${count === 1 ? "supplier" : "suppliers"} selected`,
            };
        },
    },
});
