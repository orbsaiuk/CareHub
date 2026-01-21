export const STATIC_ABOUT_CONTENT_QUERY = `
*[_type == "staticAboutContent"][0]{
  _id,
  _type,

  companySection{
    title,
    description,
  },

  visionSection{
    title,
    vissionDescription[]{
      text
    },
  },

  missionSection{
    title,
    missionDescription[]{
      text
    },
  },

  valuesSection{
    title,
    subtitle,
    values[]{
      title,
      description,
      icon{
        asset->{
          _id,
          url
        }
      }
    },
  },

  communitySection{
    title,
    description,
  },
}`;
