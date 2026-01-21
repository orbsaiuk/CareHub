import { defineField, defineType } from "sanity";

export default defineType({
  name: "staticOffersContent",
  title: "Offers Page Content",
  type: "document",
  fields: [
    defineField({
      name: "pageTitle",
      title: "Page Title",
      type: "string",
      description: "Main heading for the offers page",
    }),
    defineField({
      name: "pageDescription",
      title: "Page Description",
      type: "text",
      description: "Subtitle or description text",
    }),
    defineField({
      name: "productOffersTitle",
      title: "Product Offers Section Title",
      type: "string",
    }),
    defineField({
      name: "productOffersSubtitle",
      title: "Product Offers Section Subtitle",
      type: "string",
    }),
    defineField({
      name: "discountCodesTitle",
      title: "Discount Codes Section Title",
      type: "string",
    }),
    defineField({
      name: "discountCodesSubtitle",
      title: "Discount Codes Section Subtitle",
      type: "string",
    }),
    defineField({
      name: "subbannersTitle",
      title: "Subbanners Section Title",
      type: "string",
    }),
    defineField({
      name: "subbannersSubtitle",
      title: "Subbanners Section Subtitle",
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Offers Page Content",
      };
    },
  },
  __experimental_actions: ["update", "publish"],
});
