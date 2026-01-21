import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/serverClient";
import {
  BUSINESS_TYPES_BY_CATEGORY_QUERY,
  BUSINESS_TYPE_BY_ID_AND_CATEGORY_QUERY,
  BUSINESS_TYPE_BY_VALUE_OR_TITLE_AND_CATEGORY_QUERY,
} from "@/sanity/queries/businessTypes";

export async function getBusinessTypesByCategory(category) {
  try {
    const businessTypes = await client.fetch(BUSINESS_TYPES_BY_CATEGORY_QUERY, {
      category,
    });

    return businessTypes.map((type) => ({
      label: type.title,
      value: type.value,
      _id: type._id,
    }));
  } catch (error) {
    return [];
  }
}

export async function getCompanyTypes() {
  return getBusinessTypesByCategory("company");
}

export async function getSupplierTypes() {
  return getBusinessTypesByCategory("supplier");
}

export async function ensureBusinessTypeRef(businessType, tenantCategory) {
  if (!businessType) return null;

  // If it's already a valid reference
  if (businessType?._type === "reference" && businessType?._ref) {
    // Verify the reference exists
    try {
      const existingDoc = await writeClient.fetch(
        BUSINESS_TYPE_BY_ID_AND_CATEGORY_QUERY,
        { id: businessType._ref, category: tenantCategory }
      );
      if (existingDoc?._id) {
        return businessType;
      }
    } catch (error) {
      console.error("Error verifying businessType reference:", error);
    }
    return null;
  }

  // Extract the actual value string
  let businessValue =
    typeof businessType === "string"
      ? businessType
      : businessType?.value ||
      businessType?.title ||
      businessType?._ref ||
      null;

  // Sanitize the value - remove invisible Unicode characters and trim
  if (typeof businessValue === "string") {
    businessValue = businessValue
      .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '') // Remove zero-width spaces
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .trim();
  }

  if (!businessValue) return null;

  try {
    // Check if the value is already a valid _id
    if (
      typeof businessValue === "string" &&
      /^[a-zA-Z0-9_-]+$/.test(businessValue)
    ) {
      const existingDoc = await writeClient.fetch(
        BUSINESS_TYPE_BY_ID_AND_CATEGORY_QUERY,
        { id: businessValue, category: tenantCategory }
      );

      if (existingDoc?._id) {
        return { _type: "reference", _ref: existingDoc._id };
      }
    }

    // Find matching businessType document by value or title
    const result = await writeClient.fetch(
      BUSINESS_TYPE_BY_VALUE_OR_TITLE_AND_CATEGORY_QUERY,
      { value: businessValue, category: tenantCategory }
    );

    if (result?._id) {
      return { _type: "reference", _ref: result._id };
    }
  } catch (error) {
    console.error("Error finding businessType:", error);
  }

  return null;
}
