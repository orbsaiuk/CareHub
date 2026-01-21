import { defineField, defineType } from "sanity";

export default defineType({
    name: "staticOnboardingContent",
    title: "Onboarding Page Content",
    type: "document",
    fields: [
        defineField({
            name: "pageTitle",
            title: "Page Title",
            type: "string",
            description: "Main heading for the onboarding page",
        }),
        defineField({
            name: "pageDescription",
            title: "Page Description",
            type: "text",
            description: "Subtitle or description text",
        }),
        defineField({
            name: "companiesTitle",
            title: "Companies Section Title",
            type: "string",
        }),
        defineField({
            name: "companiesSubtitle",
            title: "Companies Section Subtitle",
            type: "string",
        }),
        defineField({
            name: "companyFeatures",
            title: "Company Features",
            type: "object",
            description: "Features section for companies",
            fields: [
                {
                    name: "title",
                    title: "Section Title",
                    type: "string",
                },
                {
                    name: "subtitle",
                    title: "Section Subtitle (Optional)",
                    type: "text",
                },
                {
                    name: "features",
                    title: "Features",
                    type: "array",
                    of: [
                        {
                            type: "object",
                            name: "companyFeature",
                            fields: [
                                {
                                    name: "title",
                                    title: "Feature Title",
                                    type: "string",
                                },
                                {
                                    name: "description",
                                    title: "Feature Description",
                                    type: "text",
                                },
                                {
                                    name: "icon",
                                    title: "Icon (SVG only)",
                                    type: "file",
                                    options: {
                                        accept: ".svg",
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        }),
        defineField({
            name: "trustedCompanies",
            title: "Trusted Companies",
            type: "array",
            of: [{ type: "reference", to: [{ type: "company" }] }],
            validation: (Rule) => Rule.max(4),
            description: "Select up to 4 companies to display in the trusted companies section",
        }),
        defineField({
            name: "suppliersTitle",
            title: "Suppliers Section Title",
            type: "string",
        }),
        defineField({
            name: "suppliersSubtitle",
            title: "Suppliers Section Subtitle",
            type: "string",
        }),
        defineField({
            name: "trustedSuppliers",
            title: "Trusted Suppliers",
            type: "array",
            of: [{ type: "reference", to: [{ type: "supplier" }] }],
            validation: (Rule) => Rule.max(4),
            description: "Select up to 4 suppliers to display in the trusted suppliers section",
        }),
        defineField({
            name: "supplierFeatures",
            title: "Supplier Features",
            type: "object",
            description: "Features section for suppliers",
            fields: [
                {
                    name: "title",
                    title: "Section Title",
                    type: "string",
                },
                {
                    name: "subtitle",
                    title: "Section Subtitle (Optional)",
                    type: "text",
                },
                {
                    name: "features",
                    title: "Features",
                    type: "array",
                    of: [
                        {
                            type: "object",
                            name: "supplierFeature",
                            fields: [
                                {
                                    name: "title",
                                    title: "Feature Title",
                                    type: "string",
                                },
                                {
                                    name: "description",
                                    title: "Feature Description",
                                    type: "text",
                                },
                                {
                                    name: "icon",
                                    title: "Icon (SVG only)",
                                    type: "file",
                                    options: {
                                        accept: ".svg",
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        }),

    ],
    preview: {
        prepare() {
            return {
                title: "Onboarding Page Content",
            };
        },
    },
    __experimental_actions: ["update", "publish"],
});
