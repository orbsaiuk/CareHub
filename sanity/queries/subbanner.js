// Minimal query → only needed to detect expiration
export const SUBBANNERS_FOR_EXPIRATION_QUERY = `
  *[_type == "subbanner"]{
    _id,
    status,
    startDate,
    endDate
  }
`;

// Full query → only for still-active subbanners
export const ACTIVE_SUBBANNERS_QUERY = `
  *[_type == "subbanner"
    && status == "active"
    && (
      !defined(startDate) || startDate <= now()
    )
    && (
      !defined(endDate) || endDate >= now()
    )
  ] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    description,
    ctaText,
    ctaLink,
    image{
      asset->{
        _id,
        url
      }
    },
    tenantType,
    status,
    company->{
      _id,
      tenantId,
      name,
      slug
    },
    supplier->{
      _id,
      tenantId,
      name,
      slug
    },
    startDate,
    endDate
  }
`;
