import { defineField, defineType } from "sanity";

export default defineType({
    name: "subbanner",
    title: "Subbanner",
    type: "document",
    fields: [
        defineField({
            name: "tenantType",
            title: "Tenant Type",
            type: "string",
            options: {
                list: [
                    { title: "Company", value: "company" },
                    { title: "Supplier", value: "supplier" },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            description: "Main heading text for the subbanner (in Arabic)",
            validation: (Rule) => Rule.required().max(200),
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
            description: "Promotional description text (in Arabic)",
            validation: (Rule) => Rule.required().max(500),
        }),
        defineField({
            name: "image",
            title: "Subbanner Image",
            type: "image",
            options: {
                hotspot: true,
                metadata: ["blurhash", "lqip", "palette"],
            },
            validation: (Rule) => Rule.required(),
            description: "Promotional image for the subbanner",
        }),
        defineField({
            name: "ctaText",
            title: "CTA Button Text",
            type: "string",
            description: "Text to display on the call-to-action button (optional)",
            placeholder: "تسوق الآن",
        }),
        defineField({
            name: "ctaLink",
            title: "CTA Link",
            type: "url",
            description: "URL where the CTA button should redirect users (optional)",
            validation: (Rule) =>
                Rule.uri({
                    scheme: ["http", "https", "mailto", "tel"],
                }),
        }),
        defineField({
            name: "startDate",
            title: "Start Date",
            type: "date",
            options: { dateFormat: "YYYY-MM-DD" },
            description: "When the subbanner becomes active (optional)",
        }),
        defineField({
            name: "endDate",
            title: "End Date",
            type: "date",
            options: { dateFormat: "YYYY-MM-DD" },
            description: "When the subbanner expires (optional)",
            validation: (Rule) =>
                Rule.custom((end, context) => {
                    const start = context.parent?.startDate;

                    if (end && !start) {
                        return "Start Date is required when End Date is provided";
                    }
                    if (end && start && end < start) {
                        return "End Date cannot be before Start Date";
                    }

                    return true;
                }),
        }),
        defineField({
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Active", value: "active" },
                    { title: "Inactive", value: "inactive" },
                    { title: "Expired", value: "expired" },
                ],
            },
            initialValue: "active",
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            title: "title",
            status: "status",
            tenantType: "tenantType",
            media: "image",
        },
        prepare({ title, status, tenantType, media }) {
            return {
                title: title,
                subtitle: `${tenantType} | ${status}`,
                media: media,
            };
        },
    },
});
