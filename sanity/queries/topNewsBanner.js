// Minimal query → only needed to detect expiration
export const TOP_NEWS_BANNERS_FOR_EXPIRATION_QUERY = `
  *[_type == "topNewsBanner"]{
    _id,
    isActive,
    startDate,
    endDate
  }
`;

// Full query → only for still-active banners
export const ACTIVE_TOP_NEWS_BANNERS_QUERY = `
  *[_type == "topNewsBanner"
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
    openInNewTab,
    displayOrder,
    startDate,
    endDate,
    showEndDate
  }
`;

export const ALL_TOP_NEWS_BANNERS_QUERY = `
*[_type == "topNewsBanner"] | order(displayOrder asc, _createdAt desc) {
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
  openInNewTab,
  isActive,
  displayOrder,
  startDate,
  endDate,
  showEndDate,
  _createdAt,
  _updatedAt
}`;

export const TOP_NEWS_BANNER_BY_ID_QUERY = `
*[_type == "topNewsBanner" && _id == $id][0] {
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
  openInNewTab,
  isActive,
  displayOrder,
  startDate,
  endDate,
  showEndDate,
  _createdAt,
  _updatedAt
}`;
