// Reusable projections
export const COMPANY_CARD_PROJECTION = `{
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

export const COMPANIES_LIST_QUERY = `
*[_type == "company"] | order(name asc) ${COMPANY_CARD_PROJECTION}
`;

export const COMPANIES_BY_TENANT_QUERY = `
*[_type == "company" && tenantType == $tenantType && tenantId == $tenantId] | order(name asc) 
`;

export const COMPANY_CITY_REGION_QUERY = `
array::unique(
  *[_type == "company" && (defined(locations[0].city) || defined(locations[0].region))]{
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

// Unique list of countries for companies
export const COMPANY_COUNTRIES_QUERY = `
array::unique(
  *[_type == "company" && defined(locations[].country)].locations[].country
)
`;

export const COMPANY_CITY_REGION_BY_TENANT_QUERY = `
array::unique(
  *[_type == "company" && tenantType == $tenantType && tenantId == $tenantId && (defined(locations[0].city) || defined(locations[0].region))]{
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

export const COMPANIES_IMAGES = `
*[_type == "company" && defined(logo.asset)] | order(coalesce(rating, 0) desc, ratingCount desc, name asc)[0...6]{
        name,
        "id": coalesce(tenantId, slug.current),
        logo{
          asset->{
            url
          }
        }
      }`;

export const COMPANY_DETAIL_QUERY = `
*[_type == "company"]{
  "id": coalesce(tenantId, slug.current)
}.id
`;

// Build a filtered/sorted list query dynamically. Returns { query, params }
export function buildCompaniesQuery({
  location,
  locationVariations, // array of location variations (English + Arabic)
  specialization, // category slug string
  businessType, // 'online-store' | 'dates-shop' | 'distributor'
  search, // text matches name or description
  tenantType, // optional tenant scoping
  tenantId, // optional tenant scoping
} = {}) {
  const filters = ["_type == 'company'"];
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
    filters.push("businessType->value == $ctype");
    params.ctype = `${businessType}`;
  }

  if (search) {
    // Use match for partials; also search rich text as plain text
    filters.push("(name match $q || pt::text(description) match $q)");
    params.q = `${search}*`;
  }

  const where = filters.length ? filters.join(" && ") : "_type == 'company'";
  const query = `* [ ${where} ] ${COMPANY_CARD_PROJECTION}`;

  return { query, params };
}
