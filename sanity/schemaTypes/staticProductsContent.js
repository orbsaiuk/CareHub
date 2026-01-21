import { defineField, defineType } from "sanity";

export default defineType({
    name: "staticProductsContent",
    title: "Products Page Content",
    type: "document",
    fields: [
        defineField({
            name: "companyTitle",
            title: "Company Products Title",
            type: "string",
            description: "Main heading for company products page",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "companySubtitle",
            title: "Company Products Subtitle",
            type: "string",
            description: "Subtitle for company products page",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "supplierTitle",
            title: "Supplier Products Title",
            type: "string",
            description: "Main heading for supplier products page",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "supplierSubtitle",
            title: "Supplier Products Subtitle",
            type: "string",
            description: "Subtitle for supplier products page",
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "Products Page Content",
            };
        },
    },
    __experimental_actions: ["update", "publish"],
});
