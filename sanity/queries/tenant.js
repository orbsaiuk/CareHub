// Get tenant document ID by tenant type and tenant ID
export const TENANT_DOC_ID_BY_TYPE_AND_TENANT_ID_QUERY = `
*[_type == $tenantType && tenantId == $tenantId][0]{ _id }`;

// Get tenant name by tenant type and tenant ID
export const TENANT_NAME_BY_TYPE_AND_TENANT_ID_QUERY = `
*[_type == $tenantType && tenantId == $tenantId][0]{ name }`;
