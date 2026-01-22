import { groq } from 'next-sanity';

// Base hospital fields
export const hospitalFields = groq`
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

// Get all active hospitals with pagination
export const getHospitalsQuery = groq`
  *[_type == "hospital" && isActive == true] | order(isFeatured desc, order asc, _createdAt desc) [$start...$end] {
    ${hospitalFields}
  }
`;

// Get total count of active hospitals
export const getHospitalsCountQuery = groq`
  count(*[_type == "hospital" && isActive == true])
`;

// Get hospital by slug
export const getHospitalBySlugQuery = groq`
  *[_type == "hospital" && slug.current == $slug && isActive == true][0] {
    ${hospitalFields},
    detailedDescription,
    "doctors": *[_type == "doctor" && isActive == true && ^._id in hospitals[].hospital._ref] | order(isFeatured desc, rating desc) [0...20] {
      _id,
      name,
      "slug": slug.current,
      title,
      "specialty": specialty->{name, icon},
      image,
      experienceYears,
      consultationFee,
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

// Get hospital by Clerk user ID
export const getHospitalByClerkIdQuery = groq`
  *[_type == "hospital" && clerkUserId == $clerkUserId][0] {
    ${hospitalFields},
    detailedDescription
  }
`;

// Get featured hospitals
export const getFeaturedHospitalsQuery = groq`
  *[_type == "hospital" && isActive == true && isFeatured == true] | order(order asc, _createdAt desc) [0...$limit] {
    ${hospitalFields}
  }
`;

// Get hospitals by type
export const getHospitalsByTypeQuery = groq`
  *[_type == "hospital" && isActive == true && type == $type] | order(isFeatured desc, rating desc, _createdAt desc) [$start...$end] {
    ${hospitalFields}
  }
`;

// Get hospitals by specialty
export const getHospitalsBySpecialtyQuery = groq`
  *[_type == "hospital" && isActive == true && $specialtyId in specialties[]._ref] | order(isFeatured desc, rating desc) [$start...$end] {
    ${hospitalFields}
  }
`;

// Search hospitals
export const searchHospitalsQuery = groq`
  *[_type == "hospital" && isActive == true && (
    name match $searchTerm + "*" ||
    description match $searchTerm + "*" ||
    address.city match $searchTerm + "*"
  )] | order(isFeatured desc, rating desc, _createdAt desc) [0...$limit] {
    ${hospitalFields}
  }
`;

// Get hospitals with emergency services
export const getEmergencyHospitalsQuery = groq`
  *[_type == "hospital" && isActive == true] | order(rating desc) [0...$limit] {
    ${hospitalFields}
  }
`;

// Get hospitals by location (city)
export const getHospitalsByCityQuery = groq`
  *[_type == "hospital" && isActive == true && address.city == $city] | order(isFeatured desc, rating desc) [$start...$end] {
    ${hospitalFields}
  }
`;

// Get filtered hospitals
export const getFilteredHospitalsQuery = groq`
  *[_type == "hospital" && isActive == true
    ${`&& ($type == null || type == $type)`}
    ${`&& ($specialtyId == null || $specialtyId in specialties[]._ref)`}
    ${`&& ($city == null || address.city == $city)`}
  ] | order(isFeatured desc, rating desc, _createdAt desc) [$start...$end] {
    ${hospitalFields}
  }
`;
