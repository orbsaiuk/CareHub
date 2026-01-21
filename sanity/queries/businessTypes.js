export const ALL_BUSINESS_TYPES_QUERY = `
*[_type=="businessType"] | order(coalesce(displayOrder, 999) asc, title asc){
  _id,
  title,
  "slug": slug.current,
  "value": value,
  tenantCategory,
  icon,
  "iconUrl": icon.asset->url,
  "lqip": icon.asset->metadata.lqip,
  displayOrder
}`;

export const BUSINESS_TYPE_BY_SLUG_QUERY = `
*[_type=="businessType" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  "value": value,
  tenantCategory,
  icon,
  "iconUrl": icon.asset->url,
  displayOrder
}`;

export const BUSINESS_TYPES_BY_CATEGORY_QUERY = `
*[_type=="businessType" && tenantCategory == $category] | order(coalesce(displayOrder, 999) asc, title asc){
  _id,
  title,
  "slug": slug.current,
  "value": value,
  tenantCategory,
  icon,
  "iconUrl": icon.asset->url,
  "lqip": icon.asset->metadata.lqip,
  displayOrder
}`;

export const BUSINESS_TYPE_BY_ID_AND_CATEGORY_QUERY = `
*[_type == "businessType" && _id == $id && tenantCategory == $category][0]{ _id }
`;

export const BUSINESS_TYPE_BY_VALUE_OR_TITLE_AND_CATEGORY_QUERY = `
*[_type == "businessType" && (value == $value || title == $value) && tenantCategory == $category][0]{ _id }
`;
