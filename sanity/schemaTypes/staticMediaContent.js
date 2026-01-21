import { defineField, defineType } from "sanity";

export default defineType({
    name: "staticMediaContent",
    title: "Media Page Content",
    type: "document",
    fields: [
        defineField({
            name: "aboutSection",
            title: "About Section",
            type: "object",
            fields: [
                {
                    name: "title",
                    title: "Section Title",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                },
                {

                    name: "description",
                    title: "Description",
                    type: "array",
                    of: [{ type: "block" }],
                    description: "Rich text content for about description",
                    validation: (Rule) => Rule.required(),
                },
            ],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "goalsSection",
            title: "Goals Section",
            type: "object",
            fields: [
                {
                    name: "title",
                    title: "Section Title",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: "goals",
                    title: "Goals",
                    type: "array",
                    of: [{
                        type: "object",
                        fields: [
                            {
                                name: "number",
                                title: "Goal Number",
                                type: "string",
                                validation: (Rule) => Rule.required(),
                            },
                            {
                                name: "title",
                                title: "Goal Title",
                                type: "string",
                                validation: (Rule) => Rule.required(),
                            },
                            {
                                name: "description",
                                title: "Goal Description",
                                type: "text",
                                validation: (Rule) => Rule.required(),
                            },
                        ],
                        preview: {
                            select: {
                                title: "number",
                                subtitle: "title",
                            },
                        },
                    }],
                    validation: (Rule) => Rule.required().min(1).max(4),
                }
            ],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "contactSection",
            title: "Contact Section",
            type: "object",
            fields: [
                {
                    name: "title",
                    title: "Section Title",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: "description",
                    title: "Description",
                    type: "text",
                    validation: (Rule) => Rule.required(),
                },
            ],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "contactInfo",
            title: "Media Contact Information",
            type: "object",
            fields: [
                {
                    name: "phones",
                    title: "Phone Numbers",
                    type: "array",
                    of: [{ type: "string" }],
                    validation: (Rule) => Rule.required().min(1),
                },
                {
                    name: "email",
                    title: "Email Address",
                    type: "string",
                    validation: (Rule) => Rule.required().email(),
                },
                {
                    name: "address",
                    title: "Physical Address",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: "workingHours",
                    title: "Working Hours",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: "weekendHours",
                    title: "Weekend Hours",
                    type: "string",
                },
            ],
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "Media Page Content",
            };
        },
    },
    // Singleton configuration - prevent multiple documents
    __experimental_actions: ["update", "publish"],
});
