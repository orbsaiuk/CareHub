import { defineField, defineType } from "sanity";

export default defineType({
    name: "vipCompanies",
    title: "VIP Companies",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            initialValue: "VIP Companies",
            readOnly: true,
            hidden: true,
        }),
        defineField({
            name: "companies",
            title: "VIP Companies",
            description: "Select companies to display at the top of search results",
            type: "array",
            of: [
                {
                    type: "reference",
                    to: [{ type: "company" }],
                },
            ],
            validation: (Rule) => Rule.unique(),
        }),
        defineField({
            name: "products",
            title: "VIP Company Products",
            description: "Select company products to display at the top of search results",
            type: "array",
            of: [
                {
                    type: "reference",
                    to: [{ type: "product" }],
                    options: {
                        filter: 'tenantType == "company"',
                    },
                },
            ],
            validation: (Rule) => Rule.unique(),
        }),
    ],
    preview: {
        select: {
            companies: "companies",
        },
        prepare({ companies }) {
            const count = companies?.length || 0;
            return {
                title: "VIP Companies",
                subtitle: `${count} ${count === 1 ? "company" : "companies"} selected`,
            };
        },
    },
});
