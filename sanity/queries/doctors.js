import { groq } from 'next-sanity';

// Base doctor fields
export const doctorFields = groq`
  _id,
  _createdAt,
  name,
  "slug": slug.current,
  title,
  "specialty": specialty->{
    _id,
    name,
    "slug": slug.current,
    icon,
    color
  },
  subSpecialties,
  bio,
  image,
  experienceYears,
  qualifications,
  "facilities": facilities[]{
    "facility": facility->{
      _id,
      name,
      "slug": slug.current,
      type,
      logo,
      "address": address.city,
      phone
    },
    isPrimary
  },
  availability,
  rating,
  reviewsCount,
  phone,
  email,
  clerkUserId,
  isActive,
  isFeatured,
  order
`;

// Get all active doctors with pagination
export const getDoctorsQuery = groq`
  *[_type == "doctor" && isActive == true] | order(isFeatured desc, order asc, _createdAt desc) [$start...$end] {
    ${doctorFields}
  }
`;

// Get total count of active doctors
export const getDoctorsCountQuery = groq`
  count(*[_type == "doctor" && isActive == true])
`;

// Get doctor by slug
export const getDoctorBySlugQuery = groq`
  *[_type == "doctor" && slug.current == $slug && isActive == true][0] {
    ${doctorFields},
    description,
    "reviews": *[_type == "review" && references(^._id)] | order(_createdAt desc) [0...10] {
      _id,
      rating,
      comment,
      "user": user->{name, image},
      _createdAt
    }
  }
`;

// Get doctor by Clerk user ID
export const getDoctorByClerkIdQuery = groq`
  *[_type == "doctor" && clerkUserId == $clerkUserId][0] {
    ${doctorFields},
    description
  }
`;

// Get featured doctors
export const getFeaturedDoctorsQuery = groq`
  *[_type == "doctor" && isActive == true && isFeatured == true] | order(order asc, _createdAt desc) [0...$limit] {
    ${doctorFields}
  }
`;

// Get doctors by specialty
export const getDoctorsBySpecialtyQuery = groq`
  *[_type == "doctor" && isActive == true && specialty._ref == $specialtyId] | order(isFeatured desc, rating desc, _createdAt desc) [$start...$end] {
    ${doctorFields}
  }
`;

// Get doctors by facility
export const getDoctorsByFacilityQuery = groq`
  *[_type == "doctor" && isActive == true && $facilityId in facilities[].facility._ref] | order(isFeatured desc, rating desc) [$start...$end] {
    ${doctorFields}
  }
`;

// Search doctors
export const searchDoctorsQuery = groq`
  *[_type == "doctor" && isActive == true && (
    name match $searchTerm + "*" ||
    bio match $searchTerm + "*" ||
    specialty->name match $searchTerm + "*"
  )] | order(isFeatured desc, rating desc, _createdAt desc) [0...$limit] {
    ${doctorFields}
  }
`;

// Get top rated doctors
export const getTopRatedDoctorsQuery = groq`
  *[_type == "doctor" && isActive == true && rating >= 4.5] | order(rating desc, reviewsCount desc) [0...$limit] {
    ${doctorFields}
  }
`;

// Get doctors with filters
export const getFilteredDoctorsQuery = groq`
  *[_type == "doctor" && isActive == true
    ${`&& ($specialtyId == null || specialty._ref == $specialtyId)`}
    ${`&& ($facilityId == null || $facilityId in facilities[].facility._ref)`}
  ] | order(isFeatured desc, rating desc, _createdAt desc) [$start...$end] {
    ${doctorFields}
  }
`;

// Search doctors with multiple filters (search term, specialty, city)
export const searchDoctorsWithFiltersQuery = groq`
  *[_type == "doctor" && isActive == true
    && ($searchTerm == "" || name match "*" + $searchTerm + "*" || bio match "*" + $searchTerm + "*" || specialty->name match "*" + $searchTerm + "*")
    && ($specialtyName == "" || specialty->name match $specialtyName)
    && ($city == "" || $city in facilities[].facility->address.city)
  ] | order(isFeatured desc, rating desc, _createdAt desc) [$start...$end] {
    ${doctorFields}
  }
`;

// Count doctors with multiple filters
export const searchDoctorsWithFiltersCountQuery = groq`
  count(*[_type == "doctor" && isActive == true
    && ($searchTerm == "" || name match "*" + $searchTerm + "*" || bio match "*" + $searchTerm + "*" || specialty->name match "*" + $searchTerm + "*")
    && ($specialtyName == "" || specialty->name match $specialtyName)
    && ($city == "" || $city in facilities[].facility->address.city)
  ])
`;
