import { defineField, defineType } from "sanity";

export default defineType({
  name: "staticHomeContent",
  title: "Home Page Content",
  type: "document",
  fields: [
    // Public Home Hero Section (for companies and suppliers)
    defineField({
      name: "publicHero",
      title: "Public Home Hero Section",
      type: "object",
      description: "Hero section displayed for companies and suppliers on the home page",
      fields: [
        {
          name: "title",
          title: "Hero Title",
          type: "string",
          description: "Main title for the hero section",
        },
        {
          name: "subtitle",
          title: "Hero Subtitle",
          type: "text",
          description: "Subtitle/description text below the title",
        },
        {
          name: "companiesButtonText",
          title: "Companies Button Text",
          type: "string",
          description: "Text for the companies CTA button",
        },
        {
          name: "suppliersButtonText",
          title: "Suppliers Button Text",
          type: "string",
          description: "Text for the suppliers CTA button",
        },
      ],
    }),
    // Business Types Section
    defineField({
      name: "businessTypesSection",
      title: "Business Types Section",
      type: "object",
      description: "Section displaying business type categories",
      fields: [
        {
          name: "title",
          title: "Section Title",
          type: "string",
        },
      ],
    }),
    // Featured Companies Section Title (for public home)
    defineField({
      name: "featuredCompaniesTitle",
      title: "Featured Companies Section Title",
      type: "string",
      description: "Title for the featured companies section on public home",
    }),
    // Featured Suppliers Section Title (for public home)
    defineField({
      name: "featuredSuppliersTitle",
      title: "Featured Suppliers Section Title",
      type: "string",
      description: "Title for the featured suppliers section on public home",
    }),
    // Product Categories Section Title (for public home)
    defineField({
      name: "productCategoriesTitle",
      title: "Product Categories Section Title",
      type: "string",
      description: "Title for the product categories section on public home (e.g., تصفح المنتج)",
    }),
    defineField({
      name: "heroSearchTitle",
      title: "Hero Search Title",
      type: "string",
    }),
    defineField({
      name: "heroVideo",
      title: "Hero Video",
      type: "object",
      fields: [
        {
          name: "desktop",
          title: "Desktop Video",
          type: "file",
          options: {
            accept: "video/*",
          },
          description: "Video for desktop screens",
        },
        {
          name: "mobile",
          title: "Mobile Video",
          type: "file",
          options: {
            accept: "video/*",
          },
          description: "Video for mobile screens",
        },
      ],
      description:
        "Background videos for the hero section. Separate videos for desktop and mobile for optimal performance.",
    }),
    defineField({
      name: "discover",
      title: "Discover Section",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "description",
          title: "Description",
          type: "text",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "image",
          title: "Discover Image",
          type: "image",
          options: {
            hotspot: true,
          },
          description: "Image to display in the discover section",
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "how",
      title: "How It Works",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Section Title",
          type: "string",
        },
        {
          name: "subtitle",
          title: "Section Subtitle (Optional)",
          type: "text",
        },
        {
          name: "steps",
          title: "Steps",
          type: "array",
          of: [
            {
              type: "object",
              name: "howStep",
              fields: [
                { name: "title", title: "Title", type: "string" },
                { name: "description", title: "Description", type: "text" },
                {
                  name: "icon",
                  title: "Icon (SVG only)",
                  type: "file",
                  options: {
                    accept: ".svg",
                  },
                },
              ],
            },
          ],
        },
      ],
    }),

    defineField({
      name: "why",
      title: "Why Choose Us",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Section Title",
          type: "string",
        },
        {
          name: "subtitle",
          title: "Section Subtitle (Optional)",
          type: "text",
        },
        {
          name: "features",
          title: "Features",
          type: "array",
          of: [
            {
              type: "object",
              name: "whyFeature",
              fields: [
                { name: "title", title: "Title", type: "string" },
                { name: "description", title: "Description", type: "text" },
                {
                  name: "icon",
                  title: "Icon (SVG only)",
                  type: "file",
                  options: {
                    accept: ".svg",
                  },
                },
              ],
            },
          ],
        },
      ],
    }),

    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        {
          type: "object",
          name: "faqItem",
          fields: [
            { name: "q", title: "Question", type: "string" },
            { name: "a", title: "Answer", type: "text" },
            {
              name: "target",
              title: "Target Audience",
              type: "string",
              options: {
                list: [
                  { title: "All", value: "all" },
                  { title: "Business (Companies & Suppliers)", value: "business" },
                ],
                layout: "radio",
              },
              initialValue: "all",
              description: "Select who should see this FAQ: 'All' for everyone, 'Business' for companies and suppliers only",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "categoriesTitle",
      title: "Categories Section Title",
      type: "string",
      description: "Title for the categories section on the home page",
    }),
    defineField({
      name: "blogTitle",
      title: "Blog Section Title",
      type: "string",
      description: "Title for the blog section on the home page",
    }),
    defineField({
      name: "faqTitle",
      title: "FAQ Section Title",
      type: "string",
      description: "Title for the FAQ section on the home page",
    }),
    defineField({
      name: "featuredCompanies",
      title: "Featured Companies",
      type: "array",
      of: [{
        type: "reference",
        to: [{ type: "company" }],
        options: {
          disableNew: true
        }
      }],
      validation: (Rule) => Rule.max(4).unique(),
      description: "Select up to 4 unique companies to feature on the home page (add only, cannot edit existing)",
      hidden: ({ currentUser }) => {
        const contentCreatorOnlyEmails = ['mohamadnasr36@gmail.com'];
        return contentCreatorOnlyEmails.includes(currentUser?.email);
      },
    }),
    defineField({
      name: "featuredSuppliers",
      title: "Featured Suppliers",
      type: "array",
      of: [{
        type: "reference",
        to: [{ type: "supplier" }],
        options: {
          disableNew: true
        }
      }],
      validation: (Rule) => Rule.max(4).unique(),
      description: "Select up to 4 unique suppliers to feature on the home page (add only, cannot edit existing)",
      hidden: ({ currentUser }) => {
        const contentCreatorOnlyEmails = ['mohamadnasr36@gmail.com'];
        return contentCreatorOnlyEmails.includes(currentUser?.email);
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Home Page Content",
      };
    },
  },
  // Singleton validation - prevent multiple documents
  __experimental_actions: ["update", "publish" /* 'create', 'delete' */],
});
