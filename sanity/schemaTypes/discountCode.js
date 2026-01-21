import { defineField, defineType } from "sanity";

export default defineType({
    name: "discountCode",
    title: "Discount Code",
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
            name: "company",
            title: "Company",
            type: "reference",
            to: [{ type: "company" }],
            description: "Select the company for this discount code",
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
            description: "Select the supplier for this discount code",
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
            name: "code",
            title: "Discount Code",
            type: "string",
            description: "The coupon code customers will use (will be converted to uppercase)",
            validation: (Rule) => Rule.required().uppercase().min(3).max(20),
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
            description: "Description of the discount (e.g., '10% off', '£50 off', etc.)",
            validation: (Rule) => Rule.required(),
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
            options: {
                list: [
                    { title: "Active", value: "active" },
                    { title: "In-Active", value: "inactive" },
                    { title: "Expired", value: "expired" },
                ],
            },
            initialValue: "active",
        }),
        defineField({
            name: "ctaText",
            title: "CTA Button Text",
            type: "string",
            description: "Text to display on the call-to-action button (e.g., 'Shop Now', 'Get Offer')",
            placeholder: "تسوق الآن",
        }),
        defineField({
            name: "ctaLink",
            title: "CTA Link",
            type: "url",
            description: "URL where the CTA button should redirect users",
            validation: (Rule) =>
                Rule.uri({
                    scheme: ["http", "https", "mailto", "tel"],
                }),
        }),
    ],
    preview: {
        select: {
            code: "code",
            description: "description",
            status: "status",
            tenantType: "tenantType",
        },
        prepare({ code, description, status, tenantType }) {
            return {
                title: code,
                subtitle: `${description} | ${tenantType} | ${status}`,
            };
        },
    },
});
