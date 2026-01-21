import { defineField, defineType } from "sanity";

export default defineType({
  name: "plan",
  title: "Subscription Plan",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Plan Key",
      type: "string",
      options: {
        list: [
          { title: "Free", value: "free" },
          { title: "Pro", value: "pro" },
          { title: "Enterprise", value: "enterprise" },
        ],
      },
      validation: (Rule) => Rule.required(),
      description: "Unique identifier for the plan type",
    }),
    defineField({
      name: "name",
      title: "Plan Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Display name (e.g., الباقة المجانية, الباقة الاحترافية)",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "object",
      description: "Required for paid plans",
      hidden: ({ document }) => document?.key === "free",
      fields: [
        defineField({
          name: "amount",
          title: "Amount",
          type: "number",
          validation: (Rule) => Rule.min(0),
        }),
        defineField({
          name: "currency",
          title: "Currency",
          type: "string",
          options: { list: [{ title: "GBP", value: "gbp" }] },
          initialValue: "gbp",
        }),
        defineField({
          name: "interval",
          title: "Billing Interval",
          type: "string",
          options: { list: [{ title: "Yearly", value: "year" }] },
          initialValue: "year",
        }),
      ],
    }),
    // UI Display - Features list for pricing cards
    defineField({
      name: "features",
      title: "Features (UI Display)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Feature Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "included",
              title: "Included",
              type: "boolean",
              initialValue: true,
            }),
          ],
        },
      ],
      description: "Features shown on pricing cards",
    }),
    // Actual limits for access control
    defineField({
      name: "limits",
      title: "Usage Limits",
      type: "object",
      fields: [
        defineField({
          name: "blogPosts",
          title: "Blog Posts Limit",
          type: "number",
          description: "-1 for unlimited",
          initialValue: -1,
        }),
      ],
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "isPopular",
      title: "Is Popular",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
    // Stripe IDs - Required only for paid plans
    defineField({
      name: "stripeProductId",
      title: "Stripe Product ID",
      type: "string",
      description: "Required for paid plans only",
      hidden: ({ document }) => document?.key === "free",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const key = context.document?.key;
          if (key !== "free" && !value) {
            return "Stripe Product ID is required for paid plans";
          }
          return true;
        }),
    }),
    defineField({
      name: "stripePriceId",
      title: "Stripe Price ID",
      type: "string",
      description: "Required for paid plans only",
      hidden: ({ document }) => document?.key === "free",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const key = context.document?.key;
          if (key !== "free" && !value) {
            return "Stripe Price ID is required for paid plans";
          }
          return true;
        }),
    }),
    // Trial config - Stripe handles fixed trials (only for paid plans)
    defineField({
      name: "trialDays",
      title: "Trial Days (Stripe)",
      type: "number",
      description: "Fixed trial days managed by Stripe. Leave empty for no trial.",
      hidden: ({ document }) => document?.key === "free" || document?.flexibleTrial,
      validation: (Rule) => Rule.min(1).max(365),
    }),
    // Flexible trial - manual/unknown duration (Sanity-only)
    defineField({
      name: "flexibleTrial",
      title: "Flexible Trial",
      type: "boolean",
      initialValue: false,
      hidden: ({ document }) => document?.key === "free",
      description: "Enable for trials with unknown/manual duration (not managed by Stripe)",
    }),
  ],
  preview: {
    select: {
      title: "name",
      key: "key",
      amount: "price.amount",
      currency: "price.currency",
      interval: "price.interval",
      trialDays: "trialDays",
      flexibleTrial: "flexibleTrial",
    },
    prepare({ title, key, amount, currency, interval, trialDays, flexibleTrial }) {
      const price = key === "free" || !amount ? "Free" : `${amount} ${currency?.toUpperCase()}/${interval}`;
      let trial = "";
      if (flexibleTrial) trial = " | Flexible trial";
      else if (trialDays) trial = ` | ${trialDays}-day trial`;
      return { title, subtitle: `[${key}] ${price}${trial}` };
    },
  },
  orderings: [
    { title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
    { title: "Price", name: "priceAsc", by: [{ field: "price.amount", direction: "asc" }] },
  ],
});
