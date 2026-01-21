export const STATIC_FOOTER_CONTENT_QUERY = `
*[_type == "staticFooterContent"][0]{
  _id,
  _type,
  socialLinks{
    linkedin,
    facebook,
    instagram,
    twitter
  },
}`;
