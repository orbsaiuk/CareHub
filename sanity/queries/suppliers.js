// Collection queries for suppliers (mirrors companies.js)

export const SUPPLIER_CARD_PROJECTION = `{
  "id": coalesce(tenantId, slug.current),
  tenantId,
  logo{
    asset->{
      url
    }
  },
  name,
  rating,
  ratingCount,
  "location": coalesce(
    select(
      defined(locations[0].address) && defined(locations[0].city) && defined(locations[0].region) && defined(locations[0].country) =>
        locations[0].address + ", " + locations[0].city + ", " + locations[0].region + ", " + locations[0].country,
      defined(locations[0].address) && defined(locations[0].city) && defined(locations[0].country) =>
        locations[0].address + ", " + locations[0].city + ", " + locations[0].country,
      defined(locations[0].address) && defined(locations[0].country) =>
        locations[0].address + ", " + locations[0].country,
      defined(locations[0].city) && defined(locations[0].region) && defined(locations[0].country) =>
        locations[0].city + ", " + locations[0].region + ", " + locations[0].country,
      defined(locations[0].city) && defined(locations[0].country) =>
        locations[0].city + ", " + locations[0].country
    ),
    coalesce(locations[0].address, locations[0].city, locations[0].region, locations[0].country)
  ),
  openingHours,
  "description": pt::text(description),

  tenantType,
  businessType->{
    _id,
    title,
    value
  }
}`;

export const SUPPLIERS_LIST_QUERY = `
*[_type == "supplier"] | order(name asc) ${SUPPLIER_CARD_PROJECTION}
`;

export const SUPPLIER_CITY_REGION_QUERY = `
array::unique(
  *[_type == "supplier" && (defined(locations[0].city) || defined(locations[0].region))]{
    "cr": coalesce(
      select(
        defined(locations[0].city) && defined(locations[0].region) => locations[0].city + ", " + locations[0].region,
        defined(locations[0].city) => locations[0].city,
        defined(locations[0].region) => locations[0].region
      ),
      ""
    )
  }.cr
)
`;

// Unique list of countries for suppliers
export const SUPPLIER_COUNTRIES_QUERY = `
array::unique(
  *[_type == "supplier" && defined(locations[].country)].locations[].country
)
`;

export function buildSuppliersQuery({
  location,
  locationVariations, // array of location variations (English + Arabic)
  specialization, // category slug string
  businessType, // 'dates-factory' | 'packaging-factory' | 'wrapping-factory' | 'farm' | 'wholesaler' | 'exporter'
  search, // text matches name or description
  tenantType, // optional tenant scoping
  tenantId, // optional tenant scoping
} = {}) {
  const filters = ["_type == 'supplier'"];
  const params = {};

  if (tenantType) {
    filters.push("tenantType == $tenantType");
    params.tenantType = `${tenantType}`;
  }
  if (tenantId) {
    filters.push("tenantId == $tenantId");
    params.tenantId = `${tenantId}`;
  }

  if (location && locationVariations && locationVariations.length > 0) {
    // Match any location with a country that matches any variation
    const locationConditions = locationVariations.map((_, index) =>
      `country match $loc${index}`
    ).join(' || ');
    filters.push(
      `count(locations[defined(country) && (${locationConditions})]) > 0`
    );
    locationVariations.forEach((variation, index) => {
      params[`loc${index}`] = `*${variation}*`;
    });
  }

  if (businessType) {
    filters.push("businessType->value == $stype");
    params.stype = `${businessType}`;
  }

  if (search) {
    filters.push("(name match $q || pt::text(description) match $q)");
    params.q = `${search}*`;
  }

  const where = filters.length ? filters.join(" && ") : "_type == 'supplier'";
  const query = `* [ ${where} ] ${SUPPLIER_CARD_PROJECTION}`;

  return { query, params };
}

export const SUPPLIER_DETAIL_QUERY = `
*[_type == "supplier"]{
  "id": coalesce(tenantId, slug.current)
}.id
`;
