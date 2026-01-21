import { defineField, defineType } from "sanity";

export default defineType({
  name: "staticTenantListContent",
  title: "Suppliers Page Content",
  type: "document",
  fields: [
    defineField({
      name: "companiesPageTitle",
      title: "Companies Page Title",
      type: "string",
      description: "Main heading for the companies page",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "companiesPageSubtitle",
      title: "Companies Page Subtitle",
      type: "string",
      description: "Subtitle for companies page",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "suppliersPageTitle",
      title: "Suppliers Page Title",
      type: "string",
      description: "Main heading for the suppliers page",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "suppliersPageSubtitle",
      title: "Suppliers Page Subtitle",
      type: "string",
      description: "Subtitle for suppliers page",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Tenant List Page Content",
      };
    },
  },
  __experimental_actions: ["update", "publish"],
});
