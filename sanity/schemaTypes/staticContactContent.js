import { defineField, defineType } from "sanity";

export default defineType({
    name: "staticContactContent",
    title: "Contact Page Content",
    type: "document",
    fields: [
        defineField({
            name: "pageTitle",
            title: "Page Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "pageDescription",
            title: "Page Description",
            type: "text",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "contactInfo",
            title: "Contact Information",
            type: "object",
            fields: [
                {
                    name: "sectionTitle",
                    title: "Section Title",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                },
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
        defineField({
            name: "formSection",
            title: "Contact Form Section",
            type: "object",
            fields: [
                {
                    name: "nameLabel",
                    title: "Name Field Label",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: "phoneLabel",
                    title: "Phone Field Label",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: "whatsappLabel",
                    title: "WhatsApp Field Label",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: "emailLabel",
                    title: "Email Field Label",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: "messageLabel",
                    title: "Message Field Label",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                },
            ],
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "Contact Page Content",
            };
        },
    },
    __experimental_actions: ["update", "publish"],
});
