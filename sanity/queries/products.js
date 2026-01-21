export const PRODUCTS_COUNT_BY_TENANT_QUERY = `
count(*[_type == "product" && tenantType == $tenantType && tenantId == $tenantId])
`;

export const PRODUCTS_BY_TENANT_QUERY = `
*[_type == "product" && tenantType == $tenantType && tenantId == $tenantId] | order(_createdAt desc) [$offset...$end] {
  _id,
  _createdAt,
  title,
  description,
  price,
  quantity,
  currency,
  weightUnit,
  tenantType,
  tenantId,
  image {
    asset-> {
      _id,
      _ref,
      url
    }
  },
  hasOffer,
  offerType,
  offerValue,
  offerStatus
}
`;

// Query for products with active offers for public page
export const PRODUCTS_WITH_ACTIVE_OFFERS_QUERY = `
*[_type == "product" && hasOffer == true && offerStatus == "active"] | order(_createdAt desc) {
  _id,
  _createdAt,
  title,
  description,
  image {
    asset-> {
      _id,
      _ref,
      url
    }
  },
  price,
  currency,
  quantity,
  weightUnit,
  hasOffer,
  offerType,
  offerValue,
  offerStatus,
  tenantType,
  tenantId,
  "company": *[_type == "company" && tenantId == ^.tenantId][0] {
    _id,
    name,
    logo {
      asset-> {
        _id,
        url
      }
    }
  },
  "supplier": *[_type == "supplier" && tenantId == ^.tenantId][0] {
    _id,
    name,
    logo {
      asset-> {
        _id,
        url
      }
    }
  }
}
`;

// Query for products filtered by offer status for a specific tenant
export const PRODUCTS_BY_OFFER_STATUS_QUERY = `
*[_type == "product" && tenantType == $tenantType && tenantId == $tenantId && hasOffer == true && offerStatus == $offerStatus] | order(_createdAt desc) [$offset...$end] {
  _id,
  _createdAt,
  title,
  description,
  price,
  quantity,
  currency,
  weightUnit,
  tenantType,
  tenantId,
  image {
    asset-> {
      _id,
      _ref,
      url
    }
  },
  hasOffer,
  offerType,
  offerValue,
  offerStatus,
  offerActivatedAt,
  offerDeactivatedAt
}
`;

// Count query for products with specific offer status
export const PRODUCTS_COUNT_BY_OFFER_STATUS_QUERY = `
count(*[_type == "product" && tenantType == $tenantType && tenantId == $tenantId && hasOffer == true && offerStatus == $offerStatus])
`;

// Query for all products with offers for a tenant (any status)
export const PRODUCTS_WITH_OFFERS_BY_TENANT_QUERY = `
*[_type == "product" && tenantType == $tenantType && tenantId == $tenantId && hasOffer == true] | order(_createdAt desc) [$offset...$end] {
  _id,
  _createdAt,
  title,
  description,
  price,
  quantity,
  currency,
  weightUnit,
  tenantType,
  tenantId,
  image {
    asset-> {
      _id,
      _ref,
      url
    }
  },
  hasOffer,
  offerType,
  offerValue,
  offerStatus,
  offerActivatedAt,
  offerDeactivatedAt
}
`;

// Count query for products with offers (any status)
export const PRODUCTS_WITH_OFFERS_COUNT_QUERY = `
count(*[_type == "product" && tenantType == $tenantType && tenantId == $tenantId && hasOffer == true])
`;

// Get product by ID with ownership details
export const PRODUCT_BY_ID_WITH_OWNERSHIP_QUERY = `
*[_type == "product" && _id == $productId][0]{
  _id,
  title,
  tenantType,
  tenantId,
  hasOffer,
  company->{ _id, tenantId },
  supplier->{ _id, tenantId }
}`;

// Get multiple products by IDs with ownership details
export const PRODUCTS_BY_IDS_WITH_OWNERSHIP_QUERY = `
*[_type == "product" && _id in $productIds]{
  _id,
  title,
  tenantType,
  tenantId,
  company->{ _id, tenantId },
  supplier->{ _id, tenantId }
}`;

