export const STATIC_TENANT_LIST_CONTENT_QUERY = `
*[_type == "staticTenantListContent"][0]{
  _id,
  _type,
  companiesPageTitle,
  companiesPageSubtitle,
  suppliersPageTitle,
  suppliersPageSubtitle,
}`;
