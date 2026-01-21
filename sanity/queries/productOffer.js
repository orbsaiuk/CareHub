// Minimal query → only needed to detect expiration
export const PROMOTED_OFFERS_FOR_EXPIRATION_QUERY = `
  *[_type == "offersPage"
    && isPromoted == true
  ]{
    _id,
    status,
    startDate,
    endDate
  }
`;

// Full query → only for active offers
export const ACTIVE_PROMOTED_OFFERS_QUERY = `
  *[_type == "offersPage"
    && isPromoted == true
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
    tenantType,
    status,
    company->{
      _id,
      tenantId,
      name,
      slug,
      logo{
        asset->{
          _id,
          url
        }
      }
    },
    supplier->{
      _id,
      tenantId,
      name,
      slug,
      logo{
        asset->{
          _id,
          url
        }
      }
    },
    "products": products[]->{
      _id,
      title,
      description,
      image{
        asset->{
          _id,
          url
        }
      },
      price,
      currency,
      quantity,
      weightUnit,
      offerType,
      offerValue,
    }
  }
`;

export const EXPIRED_PRODUCT_OFFERS_QUERY = `
  *[_type == "offersPage"
    && (
      status == "expired" ||
      (defined(endDate) && endDate < now())
    )
  ] | order(endDate desc) {
    _id,
    _createdAt,
    _updatedAt,
    _type,
    tenantType,
    startDate,
    endDate,
    status,
    company->{
      _id,
      tenantId,
      name,
      slug,
      logo{
        asset->{
          _id,
          url
        }
      }
    },
    supplier->{
      _id,
      tenantId,
      name,
      slug,
      logo{
        asset->{
          _id,
          url
        }
      }
    },
    "products": products[]->{
      _id,
      title,
      description,
      image{
        asset->{
          _id,
          url
        }
      },
      price,
      currency,
      quantity,
      weightUnit,
      offerType,
      offerValue,
    },
    "isExpired": true
  }
`;

export const ALL_PRODUCT_OFFERS_QUERY = `
  *[_type == "offersPage"] | order(_createdAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    _type,
    tenantType,
    startDate,
    endDate,
    status,
    isPromoted,
    company->{
      _id,
      tenantId,
      name,
      slug,
      logo{
        asset->{
          _id,
          url
        }
      }
    },
    supplier->{
      _id,
      tenantId,
      name,
      slug,
      logo{
        asset->{
          _id,
          url
        }
      }
    },
    "products": products[]->{
      _id,
      title,
      description,
      image{
        asset->{
          _id,
          url
        }
      },
      price,
      currency,
      quantity,
      weightUnit,
      offerType,
      offerValue,
    },
    "isExpired": defined(endDate) && endDate < now(),
    "isActive": status == "active" && (!defined(endDate) || endDate >= now())
  }
`;
