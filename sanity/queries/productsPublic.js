// Query for all products with company/supplier info for public listing
// Public users, guests, and suppliers see products from companies only
export const PRODUCTS_LIST_QUERY = `
*[_type == "product" && tenantType == "company"] | order(_createdAt desc) {
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
      url,
      metadata {
        lqip
      }
    }
  },
  hasOffer,
  offerType,
  offerValue,
  offerStatus,
  "company": *[_type == "company" && tenantId == ^.tenantId][0] {
    _id,
    tenantId,
    name,
    location,
    logo {
      asset-> {
        _id,
        url
      }
    }
  },
  "supplier": *[_type == "supplier" && tenantId == ^.tenantId][0] {
    _id,
    tenantId,
    name,
    location,
    logo {
      asset-> {
        _id,
        url
      }
    }
  }
}
`;

// Build dynamic query for products with filters
// Public users, guests, and suppliers see products from companies only
// Companies see products from suppliers only
export function buildProductsQuery({ search, country, countryVariations, tenantType = "company" }) {
  let filter = `_type == "product" && tenantType == "${tenantType}"`;
  const params = {};

  if (search) {
    filter += ` && (title match $search || description match $search)`;
    params.search = `*${search}*`;
  }

  if (country && countryVariations && countryVariations.length > 0) {
    const entityType = tenantType === "company" ? "company" : "supplier";
    // Build OR conditions for all country variations
    const countryConditions = countryVariations.map((_, index) =>
      `country match $country${index}`
    ).join(' || ');
    filter += ` && count(*[_type == "${entityType}" && tenantId == ^.tenantId && count(locations[defined(country) && (${countryConditions})]) > 0]) > 0`;

    // Add all variations as parameters
    countryVariations.forEach((variation, index) => {
      params[`country${index}`] = `*${variation}*`;
    });
  }

  const query = `
*[${filter}] | order(_createdAt desc) {
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
      url,
      metadata {
        lqip
      }
    }
  },
  hasOffer,
  offerType,
  offerValue,
  offerStatus,
  "company": *[_type == "company" && tenantId == ^.tenantId][0] {
    _id,
    tenantId,
    name,
    location,
    logo {
      asset-> {
        _id,
        url
      }
    }
  },
  "supplier": *[_type == "supplier" && tenantId == ^.tenantId][0] {
    _id,
    tenantId,
    name,
    location,
    logo {
      asset-> {
        _id,
        url
      }
    }
  }
}
`;

  return { query, params };
}

// Get unique countries from all products
export const PRODUCT_COUNTRIES_QUERY = `
array::unique(
  *[_type == "product"]{
    "companyLocation": *[_type == "company" && tenantId == ^.tenantId][0].location,
    "supplierLocation": *[_type == "supplier" && tenantId == ^.tenantId][0].location
  }[].companyLocation + 
  *[_type == "product"]{
    "companyLocation": *[_type == "company" && tenantId == ^.tenantId][0].location,
    "supplierLocation": *[_type == "supplier" && tenantId == ^.tenantId][0].location
  }[].supplierLocation
)[defined(@)]
`;
