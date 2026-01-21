export const STATIC_NEWSLETTER_CONTENT_QUERY = `
*[_type == "staticNewsletterContent"][0]{
  _id,
  _type,
  pageTitle,
  pageDescription,
  activitiesTitle,
  activitiesSubtitle,
  hotNewsTitle,
  hotNewsSubtitle,
  subscribeTitle,
  subscribeSubtitle,
}`;
