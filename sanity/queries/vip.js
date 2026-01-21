import { COMPANY_CARD_PROJECTION } from "./companies";
import { SUPPLIER_CARD_PROJECTION } from "./suppliers";

// Fetch VIP company IDs (for filtering/sorting in search)
export const VIP_COMPANY_IDS_QUERY = `
*[_type == "vipCompanies" && _id == "vipCompanies"][0]{
  "ids": companies[]->tenantId
}.ids
`;

// Fetch VIP supplier IDs (for filtering/sorting in search)
export const VIP_SUPPLIER_IDS_QUERY = `
*[_type == "vipSuppliers" && _id == "vipSuppliers"][0]{
  "ids": suppliers[]->tenantId
}.ids
`;

// Fetch full VIP companies with card projection
export const VIP_COMPANIES_QUERY = `
*[_type == "vipCompanies" && _id == "vipCompanies"][0]{
  "companies": companies[]->${COMPANY_CARD_PROJECTION}
}.companies
`;

// Fetch full VIP suppliers with card projection
export const VIP_SUPPLIERS_QUERY = `
*[_type == "vipSuppliers" && _id == "vipSuppliers"][0]{
  "suppliers": suppliers[]->${SUPPLIER_CARD_PROJECTION}
}.suppliers
`;

// Combined query to get both VIP companies and suppliers
export const VIP_ALL_QUERY = `{
  "vipCompanyIds": *[_type == "vipCompanies" && _id == "vipCompanies"][0].companies[]->tenantId,
  "vipSupplierIds": *[_type == "vipSuppliers" && _id == "vipSuppliers"][0].suppliers[]->tenantId
}`;

// Fetch VIP company product IDs
export const VIP_COMPANY_PRODUCT_IDS_QUERY = `
*[_type == "vipCompanies" && _id == "vipCompanies"][0]{
  "ids": products[]->_id
}.ids
`;

// Fetch VIP supplier product IDs
export const VIP_SUPPLIER_PRODUCT_IDS_QUERY = `
*[_type == "vipSuppliers" && _id == "vipSuppliers"][0]{
  "ids": products[]->_id
}.ids
`;
