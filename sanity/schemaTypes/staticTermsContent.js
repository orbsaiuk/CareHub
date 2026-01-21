import { defineField, defineType } from "sanity";

export default defineType({
    name: "staticTermsContent",
    title: "Terms of Use Page Content",
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
                title: "Terms of Use Content",
            };
        },
    },
    __experimental_actions: ["update", "publish"],
});
