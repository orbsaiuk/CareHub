// Minimal query → only needed to detect expiration
export const DISCOUNT_CODES_FOR_EXPIRATION_QUERY = `
  *[_type == "discountCode"]{
    _id,
    status,
    startDate,
    endDate
  }
`;

// Full query → only for still-active codes
export const ACTIVE_DISCOUNT_CODES_QUERY = `
  *[_type == "discountCode"
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
    code,
    description,
    tenantType,
    status,
    ctaText,
    ctaLink,
    company->{
      _id,
      tenantId,
      name,
      slug,
      logo
    },
    supplier->{
      _id,
      tenantId,
      name,
      slug,
      logo
    },
    startDate,
    endDate
  }
`;
