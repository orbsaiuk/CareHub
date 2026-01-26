import { groq } from 'next-sanity';

// Base facility fields
export const facilityFields = groq`
  _id,
  _createdAt,
  name,
  "slug": slug.current,
  type,
  description,
  logo,
  images,
  "specialties": specialties[]->{
    _id,
    name,
    "slug": slug.current,
    icon,
    color
  },
  services,
  facilities,
  address,
  location,
  phone,
  emergencyPhone,
  email,
  website,
  workingHours,
  rating,
  reviewsCount,
  isActive,
  isFeatured,
  order
`;

// Get all active facilities with pagination
export const getFacilitiesQuery = groq`
  *[_type == "facility" && isActive == true] | order(isFeatured desc, order asc, _createdAt desc) [$start...$end] {
    ${facilityFields}
  }
`;

// Get total count of active facilities
export const getFacilitiesCountQuery = groq`
  count(*[_type == "facility" && isActive == true])
`;

// Get facility by slug
export const getFacilityBySlugQuery = groq`
  *[_type == "facility" && slug.current == $slug && isActive == true][0] {
    ${facilityFields},
    detailedDescription,
    "doctors": *[_type == "doctor" && isActive == true && ^._id in facilities[].facility._ref] | order(isFeatured desc, rating desc) [0...20] {
      _id,
      name,
      "slug": slug.current,
      title,
      "specialty": specialty->{name, icon},
      image,
      experienceYears,
      rating,
      reviewsCount
    },
    "reviews": *[_type == "review" && references(^._id)] | order(_createdAt desc) [0...10] {
      _id,
      rating,
      comment,
      "user": user->{name, image},
      _createdAt
    }
  }
`;

// Get facility by Clerk user ID
export const getFacilityByClerkIdQuery = groq`
  *[_type == "facility" && clerkUserId == $clerkUserId][0] {
    ${facilityFields},
    detailedDescription
  }
`;

// Get featured facilities
export const getFeaturedFacilitiesQuery = groq`
  *[_type == "facility" && isActive == true && isFeatured == true] | order(order asc, _createdAt desc) [0...$limit] {
    ${facilityFields}
  }
`;

// Get facilities by type
export const getFacilitiesByTypeQuery = groq`
  *[_type == "facility" && isActive == true && type == $type] | order(isFeatured desc, rating desc, _createdAt desc) [$start...$end] {
    ${facilityFields}
  }
`;

// Get facilities by specialty
export const getFacilitiesBySpecialtyQuery = groq`
  *[_type == "facility" && isActive == true && $specialtyId in specialties[]._ref] | order(isFeatured desc, rating desc) [$start...$end] {
    ${facilityFields}
  }
`;

// Search facilities
export const searchFacilitiesQuery = groq`
  *[_type == "facility" && isActive == true && (
    name match $searchTerm + "*" ||
    description match $searchTerm + "*" ||
    address.city match $searchTerm + "*"
  )] | order(isFeatured desc, rating desc, _createdAt desc) [0...$limit] {
    ${facilityFields}
  }
`;

// Get facilities with emergency services
export const getEmergencyFacilitiesQuery = groq`
  *[_type == "facility" && isActive == true] | order(rating desc) [0...$limit] {
    ${facilityFields}
  }
`;

// Get facilities by location (city)
export const getFacilitiesByCityQuery = groq`
  *[_type == "facility" && isActive == true && address.city == $city] | order(isFeatured desc, rating desc) [$start...$end] {
    ${facilityFields}
  }
`;

// Get filtered facilities
export const getFilteredFacilitiesQuery = groq`
  *[_type == "facility" && isActive == true
    ${`&& ($type == null || type == $type)`}
    ${`&& ($specialtyId == null || $specialtyId in specialties[]._ref)`}
    ${`&& ($city == null || address.city == $city)`}
  ] | order(isFeatured desc, rating desc, _createdAt desc) [$start...$end] {
    ${facilityFields}
  }
`;

// Get unique cities from facilities
export const getUniqueCitiesQuery = groq`
  array::unique(*[_type == "facility" && isActive == true && defined(address.city)].address.city)
`;
