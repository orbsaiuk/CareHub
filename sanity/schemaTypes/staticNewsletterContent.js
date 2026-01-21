import { defineField, defineType } from "sanity";

export default defineType({
  name: "staticNewsletterContent",
  title: "Newsletter Page Content",
  type: "document",
  fields: [
    defineField({
      name: "pageTitle",
      title: "Page Title",
      type: "string",
      description: "Main heading for the newsletter page",
    }),
    defineField({
      name: "pageDescription",
      title: "Page Description",
      type: "text",
      description: "Subtitle or description text",
    }),
    defineField({
      name: "activitiesTitle",
      title: "Activities Section Title",
      type: "string",
      description: "Main heading for the activities section",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "activitiesSubtitle",
      title: "Activities Section Subtitle",
      type: "string",
      description: "Subtitle for the activities section",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hotNewsTitle",
      title: "Hot News Section Title",
      type: "string",
      description: "Main heading for the hot news section",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hotNewsSubtitle",
      title: "News Section Subtitle",
      type: "string",
      description: "Subtitle for the hot news section",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subscribeTitle",
      title: "Subscribe Section Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subscribeSubtitle",
      title: "Subscribe Section Subtitle",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Newsletter Page Content",
      };
    },
  },
  __experimental_actions: ["update", "publish"],
});
