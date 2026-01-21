// Newsletter queries

// Reusable projections for news items
export const NEWS_CARD_PROJECTION = `{
  _id,
  title,
  slug,
  excerpt,
  previewImage{
    asset->{
      url,
      metadata{
        dimensions{
          width,
          height
        }
      }
    },
    alt
  },
  publishedDate,
  order
}`;

export const NEWS_DETAIL_PROJECTION = `{
  _id,
  title,
  slug,
  excerpt,
  description[]{
    ...,
    _type == "image" => {
      ...,
      asset->{
        url,
        metadata{
          dimensions{
            width,
            height
          }
        }
      }
    }
  },
  image{
    asset->{
      url,
      metadata{
        dimensions{
          width,
          height
        }
      }
    },
    alt
  },
  publishedDate,
  order
}`;

// Get all published news items (ordered by order field, then by date)
export const PUBLISHED_NEWS_ITEMS_QUERY = `
*[_type == "newsItem" && isPublished == true] | order(coalesce(order, 999999) asc, publishedDate desc) ${NEWS_CARD_PROJECTION}
`;

// Get news item by slug
export const NEWS_BY_SLUG_QUERY = `
*[_type == "newsItem" && slug.current == $slug && isPublished == true][0] ${NEWS_DETAIL_PROJECTION}
`;

// Reusable projection for activity detail fields
export const ACTIVITY_DETAIL_PROJECTION = `{
  _id,
  title,
  slug,
  description[]{
    ...,
    _type == "image" => {
      ...,
      asset->{
        url,
        metadata{
          dimensions{
            width,
            height
          }
        }
      }
    }
  },
  image{
    asset->{
      url,
      metadata{
        dimensions{
          width,
          height
        }
      }
    },
    alt
  },
  publishedDate,
  order
}`;

// Get published newsletter activities (ordered by order field)
export const PUBLISHED_NEWSLETTER_ACTIVITIES_QUERY = `
*[_type == "newsletterActivity" && isPublished == true] | order(coalesce(order, 999999) asc, publishedDate desc) {
  _id,
  title,
  slug,
  image{
    asset->{
      url,
      metadata{
        dimensions{
          width,
          height
        }
      }
    },
    alt
  },
  publishedDate,
  link{
    url,
    openInNewTab
  },
  buttonText,
  order
}`;

// Get activity by slug
export const ACTIVITY_BY_SLUG_QUERY = `
*[_type == "newsletterActivity" && slug.current == $slug && isPublished == true][0] ${ACTIVITY_DETAIL_PROJECTION}
`;

// Get limited number of news items (for homepage)
export const RECENT_NEWS_ITEMS_QUERY = `
*[_type == "newsItem" && isPublished == true] | order(coalesce(order, 999999) asc, publishedDate desc)[0...$limit] ${NEWS_CARD_PROJECTION}
`;
