export const STATIC_OFFERS_CONTENT_QUERY = `
*[_type == "staticOffersContent"][0]{
  _id,
  _type,
  pageTitle,
  pageDescription,
  productOffersTitle,
  productOffersSubtitle,
  discountCodesTitle,
  discountCodesSubtitle,
  subbannersTitle,
  subbannersSubtitle,
}`;
