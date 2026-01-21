import { defineField, defineType } from "sanity";

export default defineType({
    name: "contentCreatorBlog",
    title: "Content Creator Blog",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required().max(100),
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
            description: "Brief description of the blog post (for previews)",
            validation: (Rule) => Rule.required().max(200),
        }),
        defineField({
            name: "blogImage",
            title: "Blog Image",
            type: "image",
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "content",
            title: "Content",
            type: "array",
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
                                        title: "Open in new tab",
                                        name: "blank",
                                        type: "boolean",
                                        initialValue: true,
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    type: "image",
                    options: { hotspot: true },
                    fields: [
                        {
                            name: "alt",
                            type: "string",
                            title: "Alternative text",
                            description: "Important for SEO and accessibility",
                        },
                        {
                            name: "caption",
                            type: "string",
                            title: "Caption",
                        },
                    ],
                },
            ],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "target",
            title: "Target Audience",
            type: "string",
            options: {
                list: [
                    { title: "All Users", value: "all" },
                    { title: "Business Only (Companies & Suppliers)", value: "business" },
                ],
                layout: "radio",
            },
            initialValue: "all",
            description: "Select who can see this blog post",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "featured",
            title: "Featured Post",
            type: "boolean",
            description: "Mark this post as featured to highlight it",
            initialValue: false,
        }),
    ],
    preview: {
        select: {
            title: "title",
            media: "blogImage",
            target: "target",
            featured: "featured",
        },
        prepare(selection) {
            const { title, media, target, featured } = selection;
            const targetLabel = target ? `Target: ${target}` : "";
            const featuredLabel = featured ? " ⭐" : "";

            return {
                title: `${title}${featuredLabel}`,
                media,
                subtitle: targetLabel,
            };
        },
    },
    orderings: [
        {
            title: "Created Date, New",
            name: "createdAtDesc",
            by: [{ field: "_createdAt", direction: "desc" }],
        },
        {
            title: "Created Date, Old",
            name: "createdAtAsc",
            by: [{ field: "_createdAt", direction: "asc" }],
        },
        {
            title: "Title A-Z",
            name: "titleAsc",
            by: [{ field: "title", direction: "asc" }],
        },
        {
            title: "Featured First",
            name: "featuredFirst",
            by: [
                { field: "featured", direction: "desc" },
                { field: "_createdAt", direction: "desc" },
            ],
        },
    ],
});
