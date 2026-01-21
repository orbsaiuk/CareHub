import { defineField, defineType } from "sanity";

export default defineType({
  name: "newsletterActivity",
  title: "Newsletter Activity",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly identifier for the activity detail page",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Content",
      type: "array",
      components: {
        input: (props) => (
          <div style={{ direction: "rtl", textAlign: "right" }}>
            <props.renderDefault {...props} />
          </div>
        ),
        description: "Rich content with formatting, lists, images, and more",
      },
      validation: (Rule) => Rule.required(),
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
              { title: "Underline", value: "underline" },
              { title: "Strike", value: "strike-through" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                  {
                    name: "openInNewTab",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Optional caption displayed below the image",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedDate",
      title: "Published Date",
      type: "datetime",
      description: "Date when the activity was published",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "object",
      description: "Optional external link (for backward compatibility)",
      fields: [
        defineField({
          name: "url",
          title: "URL",
          type: "string",
          description: "Link URL (e.g., /offers, /companies, or external URL)",
        }),
        defineField({
          name: "openInNewTab",
          title: "Open in New Tab",
          type: "boolean",
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
      description: "Text for the call-to-action button",
      initialValue: "اكتشف الان",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "isPublished",
      title: "Published",
      type: "boolean",
      description: "Show this activity on the newsletter page",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description:
        "Lower numbers appear first. Leave empty for auto-ordering by date.",
      validation: (Rule) => Rule.min(0),
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug",
      media: "image",
      isPublished: "isPublished",
      order: "order",
    },
    prepare(selection) {
      const { title, slug, media, isPublished, order } = selection;
      const status = isPublished ? "Published" : "Draft";
      const orderText = order !== undefined ? `Order: ${order}` : "";
      const slugText = slug?.current ? `/${slug.current}` : "";
      return {
        title: title || "Untitled",
        subtitle: `${status}${orderText ? ` | ${orderText}` : ""}${slugText}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Created Date, New",
      name: "createdAtDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
});
