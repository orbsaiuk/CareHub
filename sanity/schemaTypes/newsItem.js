import { defineField, defineType } from "sanity";

export default defineType({
  name: "newsItem",
  title: "News Item",
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
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      description: "Brief description of the news item (for previews)",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "previewImage",
      title: "Preview Image (Card)",
      type: "image",
      options: { hotspot: true },
      description: "Small image displayed in news cards and lists",
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
      title: "Main Image (Detail Page)",
      type: "image",
      options: { hotspot: true },
      description: "Large image displayed on the news detail page",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedDate",
      title: "Published Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "isPublished",
      title: "Published",
      type: "boolean",
      description: "Show this news item on the newsletter page",
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
      slug: "slug.current",
      media: "previewImage",
      publishedDate: "publishedDate",
      isPublished: "isPublished",
    },
    prepare(selection) {
      const { title, slug, media, publishedDate, isPublished } = selection;
      const date = publishedDate
        ? new Date(publishedDate).toLocaleDateString("ar-EG")
        : "No date";
      const status = isPublished ? "Published" : "Draft";
      return {
        title: title || "Untitled",
        subtitle: `${slug || "no-slug"} | ${date} | ${status}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Published Date, New",
      name: "publishedDateDesc",
      by: [{ field: "publishedDate", direction: "desc" }],
    },
    {
      title: "Published Date, Old",
      name: "publishedDateAsc",
      by: [{ field: "publishedDate", direction: "asc" }],
    },
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
