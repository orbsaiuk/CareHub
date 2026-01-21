export const STATIC_PRODUCTS_CONTENT_QUERY = `
*[_type == "staticProductsContent"][0]{
  _id,
  _type,
  companyTitle,
  companySubtitle,
  supplierTitle,
  supplierSubtitle,
}`;
