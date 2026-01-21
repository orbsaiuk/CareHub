import { defineField, defineType } from "sanity";

export default defineType({
  name: "topNewsBanner",
  title: "Top News Banners",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.optional().max(100),
      description: "Main headline for the top news banner (optional)",
    }),
    defineField({
      name: "image",
      title: "Banner Image",
      type: "image",
      options: {
        hotspot: true,
        metadata: ["blurhash", "lqip", "palette"],
      },
      validation: (Rule) => Rule.required(),
      description: "High-quality banner image (recommended: 1200x600px)",
    }),
    defineField({
      name: "ctaLink",
      title: "Call to Action Link",
      type: "url",
      validation: (Rule) =>
        Rule.optional().uri({
          allowRelative: true,
          scheme: ["http", "https", "mailto", "tel"],
        }),
      description: "Where the CTA button should link to (optional)",
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in new tab?",
      type: "boolean",
      initialValue: false, // Default: open in same tab
      description: "If checked, the link will open in a new browser tab",
      hidden: ({ parent }) => !parent?.ctaLink, // Hide if no link is provided
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      initialValue: true,
      description: "Whether this banner should be displayed",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0),
      description: "Order in which banners appear (0 = first)",
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
      description: "When this banner should start showing (optional)",
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
      description: "When this banner should stop showing (optional)",
    }),
    defineField({
      name: "showEndDate",
      title: "Show End Date",
      type: "boolean",
      initialValue: true,
      description:
        "Whether to display the end date to users (only works if endDate is provided)",
      hidden: ({ parent }) => !parent?.endDate,
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      isActive: "isActive",
      displayOrder: "displayOrder",
    },
    prepare({ title, media, isActive, displayOrder }) {
      return {
        title: title || "Untitled Banner",
        subtitle: `Order: ${displayOrder} ${isActive ? "(Active)" : "(Inactive)"}`,
        media: media,
      };
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "displayOrder",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
    {
      title: "Created Date",
      name: "createdAt",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
});
