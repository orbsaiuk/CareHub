import { defineField, defineType } from "sanity";

export default defineType({
    name: "businessType",
    title: "Business Type",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "title", maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "value",
            title: "Value",
            type: "string",
            description: "The value used in forms and API calls",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "icon",
            title: "Icon",
            type: "image",
            options: { hotspot: true },
            description: "Icon image for this business type",
        }),
        defineField({
            name: "tenantCategory",
            title: "Business Category",
            type: "string",
            options: {
                list: [
                    { title: "Company", value: "company" },
                    { title: "Supplier", value: "supplier" },
                ],
                layout: "radio",
            },
            validation: (Rule) => Rule.required(),
            description: "Whether this business type is for companies or suppliers",
        }),
        defineField({
            name: "displayOrder",
            title: "Display Order",
            type: "number",
            description: "Lower numbers appear first. Items without order appear last.",
            initialValue: 0,
        }),
    ],
    orderings: [
        {
            title: "Display Order",
            name: "displayOrderAsc",
            by: [{ field: "displayOrder", direction: "asc" }, { field: "title", direction: "asc" }],
        },
    ],
    preview: {
        select: { title: "title", value: "value", media: "icon", displayOrder: "displayOrder" },
        prepare({ title, value, media, displayOrder }) {
            return {
                title,
                media,
                subtitle: `${value}${displayOrder != null ? ` | Order: ${displayOrder}` : ""}`,
            };
        },
    },
});
