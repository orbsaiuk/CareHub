import { defineField, defineType } from "sanity";
import { ApproveTenantButton } from "../components/ApproveTenantButton";

export default defineType({
  name: "tenantRequest",
  title: "Tenant Onboarding Request",
  type: "document",
  components: {
    input: (props) => (
      <>
        <ApproveTenantButton document={props.value} />
        {props.renderDefault(props)}
      </>
    ),
  },
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
      readOnly: true,
    }),

    defineField({
      name: "requestedBy",
      title: "Requested By (Clerk ID)",
      type: "string",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
      readOnly: true,
      // status is intentionally editable
    }),
    // Track created tenant to avoid duplicates
    defineField({
      name: "createdTenantId",
      title: "Created Tenant Document ID",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "rejectionReason",
      title: "Rejection Reason",
      type: "text",
      readOnly: true,
      hidden: ({ document }) => document?.status !== "rejected",
    }),
    // Basic business info
    defineField({
      name: "name",
      title: "Business Name",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
      readOnly: true,
    }),
    defineField({
      name: "email",
      title: "Contact Email",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      readOnly: true,
      description: "Optional. A default logo will be used if not provided.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      readOnly: true,
    }),
    defineField({
      name: "totalEmployees",
      title: "Total Employees",
      type: "string",
      readOnly: true,
      hidden: ({ document }) => document?.tenantType === "supplier",
    }),
    defineField({
      name: "foundingYear",
      title: "Founding Year",
      type: "number",
      readOnly: true,
    }),
    defineField({
      name: "registrationNumber",
      title: "Registration Number",
      type: "number",
      readOnly: true,
    }),

    defineField({
      name: "businessType",
      title: "Business Type",
      type: "reference",
      to: [{ type: "businessType" }],
      readOnly: true,
    }),
    defineField({
      name: "openingHours",
      title: "Opening Hours",
      type: "array",
      of: [{ type: "string" }],
      readOnly: true,
    }),

    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      readOnly: true,
      hidden: ({ document }) => document?.tenantType === "supplier",
      fields: [
        { name: "facebook", title: "Facebook", type: "url" },
        { name: "instagram", title: "Instagram", type: "url" },
        { name: "snapchat", title: "Snapchat", type: "url" },
        { name: "tiktok", title: "TikTok", type: "url" },
        { name: "whatsapp", title: "WhatsApp", type: "string" },
      ],
    }),
    defineField({
      name: "contact",
      title: "Contact",
      type: "object",
      readOnly: true,
      fields: [
        { name: "ownerName", title: "Owner Name", type: "string" },
        { name: "phone", title: "Phone", type: "string" },
        { name: "businessPhone", title: "Business Phone", type: "string" },
        { name: "email", title: "Email", type: "string" },
        { name: "address", title: "Address", type: "string" },
      ],
    }),
    defineField({
      name: "locations",
      title: "Locations",
      type: "array",
      readOnly: true,
      of: [
        {
          type: "object",
          title: "Location",
          fields: [
            { name: "country", title: "Country", type: "string" },
            { name: "city", title: "City", type: "string" },
            { name: "address", title: "Address", type: "string" },
            { name: "region", title: "Region", type: "string" },
            { name: "zipCode", title: "Zip Code", type: "string" },
            { name: "geo", title: "Geo", type: "geopoint" },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "status", media: "logo" },
  },
});
