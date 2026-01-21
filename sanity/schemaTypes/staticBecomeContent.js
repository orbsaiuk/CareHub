import { defineField, defineType } from "sanity";

export default defineType({
    name: "staticBecomeContent",
    title: "Become Page Content",
    type: "document",
    fields: [
        defineField({
            name: "pageTitle",
            title: "Page Title",
            type: "string",
            description: "Main heading for the become tenant page",
        }),
        defineField({
            name: "pageDescription",
            title: "Page Description",
            type: "text",
            description: "Subtitle or description text",
        }),
        defineField({
            name: "heroImage",
            title: "Hero Image",
            type: "image",
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: "companyTitle",
            title: "Become Company Section Title",
            type: "string",
        }),
        defineField({
            name: "companyDescription",
            title: "Become Company Description",
            type: "text",
        }),
        defineField({
            name: "companyButtonText",
            title: "Company Button Text",
            type: "string",
        }),
        defineField({
            name: "supplierTitle",
            title: "Become Supplier Section Title",
            type: "string",
        }),
        defineField({
            name: "supplierDescription",
            title: "Become Supplier Description",
            type: "text",
        }),
        defineField({
            name: "supplierButtonText",
            title: "Supplier Button Text",
            type: "string",
        }),
        defineField({
            name: "benefits",
            title: "Benefits",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        { name: "title", title: "Title", type: "string" },
                        { name: "description", title: "Description", type: "text" },
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
        }),
        defineField({
            name: "seo",
            title: "SEO",
            type: "object",
            fields: [
                { name: "metaTitle", title: "Meta Title", type: "string" },
                { name: "metaDescription", title: "Meta Description", type: "text" },
                {
                    name: "ogImage",
                    title: "Open Graph Image",
                    type: "image",
                    options: { hotspot: true },
                },
            ],
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "Become Page Content",
            };
        },
    },
    __experimental_actions: ["update", "publish"],
});
