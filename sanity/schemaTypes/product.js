import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "tenantType",
      title: "Tenant Type",
      type: "string",
      options: {
        list: [
          { title: "Company", value: "company" },
          { title: "Supplier", value: "supplier" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tenantId",
      title: "Tenant ID",
      type: "string",
      description: "Unique identifier for the tenant this review belongs to.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "reference",
      to: [{ type: "company" }],
      description: "Only set when tenantType is company",
      hidden: ({ document }) => document?.tenantType !== "company" || null,
    }),
    defineField({
      name: "supplier",
      title: "Supplier",
      type: "reference",
      to: [{ type: "supplier" }],
      description: "Only set when tenantType is supplier",
      hidden: ({ document }) => document?.tenantType !== "supplier" || null,
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
    }),
    defineField({
      name: "quantity",
      title: "Quantity (kg)",
      type: "number",
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      options: {
        list: [
          { title: "Saudi Riyal (ر.س)", value: "SAR" },
          { title: "UAE Dirham (د.إ)", value: "AED" },
          { title: "Kuwaiti Dinar (د.ك)", value: "KWD" },
          { title: "Qatari Riyal (ر.ق)", value: "QAR" },
          { title: "Bahraini Dinar (د.ب)", value: "BHD" },
          { title: "Omani Rial (ر.ع)", value: "OMR" },
          { title: "Jordanian Dinar (د.أ)", value: "JOD" },
          { title: "Lebanese Pound (ل.ل)", value: "LBP" },
          { title: "Egyptian Pound (ج.م)", value: "EGP" },
          { title: "Iraqi Dinar (د.ع)", value: "IQD" },
          { title: "Syrian Pound (ل.س)", value: "SYP" },
          { title: "Yemeni Rial (ر.ي)", value: "YER" },
        ],
      },
      initialValue: "SAR",
    }),
    defineField({
      name: "weightUnit",
      title: "Weight Unit",
      type: "string",
      options: {
        list: [
          { title: "Kilogram (كغ)", value: "kg" },
          { title: "Gram (جم)", value: "g" },
        ],
      },
      initialValue: "kg",
    }),
    defineField({
      name: "hasOffer",
      title: "Has Offer",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "offerType",
      title: "Offer Type",
      type: "string",
      options: {
        list: [
          { title: "Percentage (%)", value: "percentage" },
          { title: "Fixed Amount", value: "fixed" },
        ],
      },
    }),
    defineField({
      name: "offerValue",
      title: "Offer Value",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "offerStatus",
      title: "Offer Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Inactive", value: "inactive" },
          { title: "Scheduled", value: "scheduled" },
          { title: "Expired", value: "expired" },
        ],
      },
    }),
    defineField({
      name: "offerActivatedAt",
      title: "Offer Activated At",
      type: "datetime",
      description: "Timestamp when the offer is activated",
    }),
    defineField({
      name: "offerDeactivatedAt",
      title: "Offer Deactivated At",
      type: "datetime",
      description: "Timestamp when the offer is deactivated",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      tenantType: "tenantType",
      companyName: "company.name",
      supplierName: "supplier.name",
    },
    prepare(selection) {
      const { title, media, tenantType, companyName, supplierName } = selection;
      const tenantName = companyName || supplierName;
      let subtitle = "No tenant";
      if (tenantType && tenantName) {
        subtitle = `${tenantType} — ${tenantName}`;
      } else if (tenantType) {
        subtitle = tenantType;
      }

      return {
        title,
        subtitle,
        media,
      };
    },
  },
});
