export const OFFERS_BY_TENANT_QUERY = `
*[_type == "offers" && tenantType == $tenantType && tenantId == $tenantId] | order(_createdAt desc){
  _id,
  title,
  image{
    asset->{_id, url}
  },
  startDate,
  endDate,
  status,
  deactivatedAt,
  description,
  company->{
    name,
    logo{
      asset->{url}
    }
  },
  supplier->{
    name,
    logo{
      asset->{url}
    }
  }
}`;

export const OFFER_STATS_BY_TENANT_QUERY = `
{
  "total": count(*[_type == "offers" && tenantType == $tenantType && tenantId == $tenantId]),
  "active": count(*[_type == "offers" && tenantType == $tenantType && tenantId == $tenantId && status == "active"]),
  "inactive": count(*[_type == "offers" && tenantType == $tenantType && tenantId == $tenantId && status == "inactive"]),
}
`;

// Get offer by ID with dates for status computation
export const OFFER_BY_ID_DATES_QUERY = `
*[_type == "offers" && _id == $id][0]{ startDate, endDate }`;

// Get offer by ID with full details for deletion/ownership verification
export const OFFER_BY_ID_FULL_QUERY = `
*[_type == "offers" && _id == $offerId][0]{
  _id,
  tenantType,
  tenantId,
  company->{ _id },
  supplier->{ _id }
}`;

// Get user memberships for tenant access verification
export const USER_MEMBERSHIPS_BY_TENANT_QUERY = `
*[_type == "user" && clerkId == $userId][0]{
  memberships[tenantType == $tenantType && tenantId == $tenantId]{ tenantId }
}`;

// These queries are deprecated - use promotional banners for home page instead
// Keeping for backward compatibility, but should not be used for new features
