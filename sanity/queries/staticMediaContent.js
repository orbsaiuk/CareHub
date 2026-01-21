export const STATIC_MEDIA_CONTENT_QUERY = `
*[_type == "staticMediaContent"][0]{
  _id,
  _type,

  aboutSection{
    title,
    description,
  },

  goalsSection{
    title,
    goals[]{
      number,
      title,
      description
    },
  },

  contactSection{
    title,
    description,
  },

  contactInfo{
    phones,
    email,
    address,
    workingHours,
    weekendHours,
  },
}`;
