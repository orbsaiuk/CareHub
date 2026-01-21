import { defineField, defineType } from "sanity";

export default defineType({
    name: "staticPrivacyContent",
    title: "Privacy Policy Page Content",
    type: "document",
    fields: [
        defineField({
            name: "content",
            title: "Content",
            type: "array",
            of: [{ type: "block" }],
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "Privacy Policy Content",
            };
        },
    },
    __experimental_actions: ["update", "publish"],
});
