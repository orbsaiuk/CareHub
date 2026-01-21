export const USER_ROLE_AND_MEMBERSHIPS_BY_CLERK_ID_QUERY = `
*[_type == "user" && clerkId == $userId][0]{ role, memberships }
`;

import { COMPANY_CARD_PROJECTION } from "./companies";
import { SUPPLIER_CARD_PROJECTION } from "./suppliers";

// Unified projection for both companies and suppliers
const TENANT_CARD_PROJECTION = `{
  _type,
  "id": coalesce(tenantId, slug.current),
  tenantId,
  logo{
    asset->{
      url
    }
  },
  name,
  rating,
  ratingCount,
  "location": coalesce(
    select(
      defined(locations[0].address) && defined(locations[0].city) && defined(locations[0].region) && defined(locations[0].country) =>
        locations[0].address + ", " + locations[0].city + ", " + locations[0].region + ", " + locations[0].country,
      defined(locations[0].address) && defined(locations[0].city) && defined(locations[0].country) =>
        locations[0].address + ", " + locations[0].city + ", " + locations[0].country,
      defined(locations[0].address) && defined(locations[0].country) =>
        locations[0].address + ", " + locations[0].country,
      defined(locations[0].city) && defined(locations[0].region) && defined(locations[0].country) =>
        locations[0].city + ", " + locations[0].region + ", " + locations[0].country,
      defined(locations[0].city) && defined(locations[0].country) =>
        locations[0].city + ", " + locations[0].country
    ),
    coalesce(locations[0].address, locations[0].city, locations[0].region, locations[0].country)
  ),
  openingHours,
  "description": pt::text(description),
  tenantType,
  businessType->{
    _id,
    title,
    value
  }
}`;

export const USER_BOOKMARKS_QUERY = `
*[_type == "user" && clerkId == $uid][0]{
  bookmarks[]->${TENANT_CARD_PROJECTION}
}
`;

export const USER_PRODUCT_BOOKMARKS_QUERY = `
*[_type == "user" && clerkId == $uid][0]{
  "products": productBookmarks[]->{
    _id,
    _createdAt,
    title,
    description,
    price,
    quantity,
    currency,
    weightUnit,
    tenantType,
    tenantId,
    image {
      asset-> {
        _id,
        _ref,
        url
      }
    },
    hasOffer,
    offerType,
    offerValue,
    offerStatus,
    "company": *[_type == "company" && tenantId == ^.tenantId][0] {
      _id,
      name,
      tenantId,
      logo {
        asset-> {
          _id,
          url
        }
      }
    },
    "supplier": *[_type == "supplier" && tenantId == ^.tenantId][0] {
      _id,
      name,
      tenantId,
      logo {
        asset-> {
          _id,
          url
        }
      }
    }
  }
}
`;

export const USER_BOOKMARK_IDS_QUERY = `
*[_type == "user" && clerkId == $uid][0]{
  "bookmarks": bookmarks[]->{
    "id": coalesce(tenantId, slug.current),
    _type
  }
}
`;

export const USER_PRODUCT_BOOKMARK_IDS_QUERY = `
*[_type == "user" && clerkId == $uid][0]{
  "productBookmarks": productBookmarks[]->{
    "id": _id
  }
}
`;

export const USER_ID_BY_CLERK_ID_QUERY = `
*[_type == "user" && clerkId == $uid][0]{ _id }
`;

export const USER_BY_ID_OR_CLERKID_QUERY = `
*[_type == "user" && (_id == $id || clerkId == $clerkId)][0]{ _id }
`;

export const USER_HAS_BOOKMARK_QUERY = `
count(*[_type == "user" && _id == $uid && bookmarks[_ref == $cid]]) > 0
`;

export const USER_ID_AND_BOOKMARKS_BY_CLERK_ID_QUERY = `
*[_type == "user" && clerkId == $uid][0]{ _id, bookmarks }
`;

// Additional queries for email service
export const USER_BY_CLERK_ID_FOR_EMAIL_QUERY = `
*[_type == "user" && clerkId == $clerkId][0]{clerkId}
`;

// Get user memberships for tenant access verification
export const USER_MEMBERSHIPS_BY_TENANT_QUERY = `
*[_type == "user" && clerkId == $userId][0]{
  memberships[tenantType == $tenantType && tenantId == $tenantId]{ tenantId }
}`;
