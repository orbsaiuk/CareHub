import { defineField, defineType } from "sanity";

export default defineType({
    name: "staticFooterContent",
    title: "Footer Content",
    type: "document",
    fields: [
        defineField({
            name: "socialLinks",
            title: "Social Media Links",
            type: "object",
            fields: [
                {
                    name: "tiktok",
                    title: "TikTok URL",
                    type: "url",
                    validation: (Rule) =>
                        Rule.uri({
                            scheme: ["http", "https"],
                        }),
                },
                {
                    name: "facebook",
                    title: "Facebook URL",
                    type: "url",
                    validation: (Rule) =>
                        Rule.uri({
                            scheme: ["http", "https"],
                        }),
                },
                {
                    name: "instagram",
                    title: "Instagram URL",
                    type: "url",
                    validation: (Rule) =>
                        Rule.uri({
                            scheme: ["http", "https"],
                        }),
                },
                {
                    name: "snapchat",
                    title: "Snapchat URL",
                    type: "url",
                    validation: (Rule) =>
                        Rule.uri({
                            scheme: ["http", "https"],
                        }),
                },
            ],
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "Footer Content",
            };
        },
    },
    __experimental_actions: ["update", "publish"],
});
