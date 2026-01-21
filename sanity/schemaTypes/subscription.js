import { defineField, defineType } from "sanity";

export default defineType({
  name: "subscription",
  title: "Subscription",
  type: "document",
  fields: [
    // Tenant info
    defineField({
      name: "tenantType",
      title: "Tenant Type",
      type: "string",
      options: {
        list: [
          { title: "Company", value: "company" },
          { title: "Supplier", value: "supplier" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tenantId",
      title: "Tenant ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tenantName",
      title: "Tenant Name",
      type: "string",
    }),
    defineField({
      name: "tenant",
      title: "Tenant Reference",
      type: "reference",
      to: [{ type: "company" }, { type: "supplier" }],
    }),
    // Plan
    defineField({
      name: "plan",
      title: "Plan",
      type: "reference",
      to: [{ type: "plan" }],
      validation: (Rule) => Rule.required(),
    }),
    // Status - Synced from Stripe for paid plans
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Trialing", value: "trialing" },
          { title: "Past Due", value: "past_due" },
          { title: "Canceled", value: "canceled" },
          { title: "Expired", value: "expired" },
        ],
        layout: "dropdown",
      },
      initialValue: "active",
      validation: (Rule) => Rule.required(),
    }),
    // Dates - Managed by Stripe for paid plans
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
    }),
    // Trial info - Stripe-managed
    defineField({
      name: "trialEndDate",
      title: "Trial End Date",
      type: "datetime",
    }),
    defineField({
      name: "trialStatus",
      title: "Trial Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Flexible (Manual)", value: "flexible" },
          { title: "Expired", value: "expired" },
          { title: "Converted", value: "converted" },
        ],
      },
    }),
    // Usage tracking
    defineField({
      name: "usage",
      title: "Usage",
      type: "object",
      fields: [
        defineField({
          name: "blogPosts",
          title: "Blog Posts",
          type: "number",
          initialValue: 0,
        }),
      ],
    }),
    // Stripe IDs
    defineField({
      name: "stripeSubscriptionId",
      title: "Stripe Subscription ID",
      type: "string",
    }),
    defineField({
      name: "stripeCustomerId",
      title: "Stripe Customer ID",
      type: "string",
    }),
    // Cancellation tracking
    defineField({
      name: "cancelAtPeriodEnd",
      title: "Cancel at Period End",
      type: "boolean",
      description: "Subscription will cancel at the end of the current billing period",
      initialValue: false,
    }),
    // Trial conversion tracking
    defineField({
      name: "convertedFromTrial",
      title: "Converted from Trial",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "trialConversionDate",
      title: "Trial Conversion Date",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      tenantName: "tenantName",
      tenantType: "tenantType",
      planName: "plan.name",
      status: "status",
      startDate: "startDate",
    },
    prepare({ tenantName, tenantType, planName, status, startDate }) {
      const date = startDate ? new Date(startDate).toLocaleDateString() : "";
      return {
        title: `${tenantName || "Unknown"} (${tenantType})`,
        subtitle: `${planName} | ${status} | ${date}`,
      };
    },
  },
  orderings: [
    { title: "Start Date (Newest)", name: "startDateDesc", by: [{ field: "startDate", direction: "desc" }] },
    { title: "Status", name: "statusAsc", by: [{ field: "status", direction: "asc" }] },
  ],
});
