import { defineField, defineType } from "sanity";

export default defineType({
    name: "promotionalBanner",
    title: "Promotional Banner",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "image",
            title: "Banner Image",
            type: "image",
            description: "Optional banner image",
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: "alt",
                    type: "string",
                    title: "Alternative text",
                },
            ],
        }),
        defineField({
            name: "ctaLink",
            title: "CTA Link",
            type: "string",
            description: "URL or path for the call-to-action button",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "displayOrder",
            title: "Display Order",
            type: "number",
            description: "Lower numbers appear first",
            initialValue: 0,
            validation: (Rule) => Rule.required().integer(),
        }),
        defineField({
            name: "isActive",
            title: "Is Active",
            type: "boolean",
            description: "Toggle to show/hide this banner",
            initialValue: true,
        }),
        defineField({
            name: "startDate",
            title: "Start Date",
            type: "datetime",
            description: "When to start showing this banner (optional)",
        }),
        defineField({
            name: "endDate",
            title: "End Date",
            type: "datetime",
            description: "When to stop showing this banner (optional)",
        }),
    ],
    preview: {
        select: {
            title: "title",
            isActive: "isActive",
            media: "image",
        },
        prepare({ title, isActive, media }) {
            return {
                title: title,
                subtitle: isActive ? "Active ✓" : "Inactive ✗",
                media,
            };
        },
    },
});
