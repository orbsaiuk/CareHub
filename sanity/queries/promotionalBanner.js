// Minimal query → only needed to detect expiration
export const PROMOTIONAL_BANNERS_FOR_EXPIRATION_QUERY = `
  *[_type == "promotionalBanner"]{
    _id,
    isActive,
    startDate,
    endDate
  }
`;

// Full query → only for still-active banners
export const ACTIVE_PROMOTIONAL_BANNERS_QUERY = `
  *[_type == "promotionalBanner"
    && isActive == true
    && (
      !defined(startDate) || startDate <= now()
    )
    && (
      !defined(endDate) || endDate >= now()
    )
  ] | order(displayOrder asc, _createdAt desc) [0...5] {
    _id,
    title,
    image{
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip,
          blurhash
        }
      }
    },
    ctaLink,
    displayOrder,
    startDate,
    endDate,
  }
`;

export const ALL_PROMOTIONAL_BANNERS_QUERY = `
*[_type == "promotionalBanner"] | order(displayOrder asc, _createdAt desc) {
  _id,
  title,
  image{
    asset->{
      _id,
      url,
      metadata {
        dimensions,
        lqip,
        blurhash
      }
    }
  },
  ctaLink,
  isActive,
  displayOrder,
  startDate,
  endDate,
  _createdAt,
  _updatedAt
}`;

export const PROMOTIONAL_BANNER_BY_ID_QUERY = `
*[_type == "promotionalBanner" && _id == $id][0] {
  _id,
  title,
  image{
    asset->{
      _id,
      url,
      metadata {
        dimensions,
        lqip,
        blurhash
      }
    }
  },
  ctaLink,
  isActive,
  displayOrder,
  startDate,
  endDate,
  _createdAt,
  _updatedAt
}`;
