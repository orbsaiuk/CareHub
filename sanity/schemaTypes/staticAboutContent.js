import { defineField, defineType } from "sanity";

export default defineType({
    name: "staticAboutContent",
    title: "About Page Content",
    type: "document",
    fields: [
        defineField({
            name: "companySection",
            title: "Company Section",
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
                    description: "Rich text content for company description",
                    validation: (Rule) => Rule.required(),
                },
            ],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "missionSection",
            title: "Mission Section",
            type: "object",
            fields: [
                {
                    name: "title",
                    title: "Mission Title",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: "missionDescription",
                    title: "Mission Description",
                    type: "array",
                    of: [{
                        type: "object",
                        fields: [
                            {
                                name: "text",
                                title: "Text",
                                type: "text",
                                validation: (Rule) => Rule.required(),
                            },
                        ],
                        preview: {
                            select: {
                                title: "text",
                            },
                        },
                    }],
                    description: "Rich text content for mission description",
                }
            ],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "visionSection",
            title: "Vision Section",
            type: "object",
            fields: [
                {
                    name: "title",
                    title: "Vission Title",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: "vissionDescription",
                    title: "Vision Description",
                    type: "array",
                    of: [{
                        type: "object",
                        fields: [
                            {
                                name: "text",
                                title: "Text",
                                type: "text",
                                validation: (Rule) => Rule.required(),
                            },
                        ],
                        preview: {
                            select: {
                                title: "text",
                            },
                        },
                    }],
                    description: "Rich text content for vission description",
                }
            ],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "valuesSection",
            title: "Values Section",
            type: "object",
            fields: [
                {
                    name: "title",
                    title: "Section Title",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: "subtitle",
                    title: "Section Subtitle",
                    type: "string",
                },
                {
                    name: "values",
                    title: "Values",
                    type: "array",
                    of: [{
                        type: "object",
                        fields: [
                            {
                                name: "title",
                                title: "Value Title",
                                type: "string",
                                validation: (Rule) => Rule.required(),
                            },
                            {
                                name: "description",
                                title: "Value Description",
                                type: "text",
                                validation: (Rule) => Rule.required(),
                            },
                            {
                                name: "icon",
                                title: "Icon (SVG only)",
                                type: "file",
                                options: {
                                    accept: ".svg",
                                },
                            },
                        ],
                        preview: {
                            select: {
                                title: "title",
                                subtitle: "description",
                            },
                        },
                    }],
                    validation: (Rule) => Rule.required().min(1).max(4),
                }
            ],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "communitySection",
            title: "Community Section",
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
    ],
    preview: {
        prepare() {
            return {
                title: "About Page Content",
            };
        },
    },
    // Singleton configuration - prevent multiple documents
    __experimental_actions: ["update", "publish"],
});
