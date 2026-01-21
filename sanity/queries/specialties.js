import { groq } from 'next-sanity';

// Base specialty fields
export const specialtyFields = groq`
  _id,
  _createdAt,
  name,
  "slug": slug.current,
  nameEn,
  description,
  icon,
  image,
  color,
  "parentSpecialty": parentSpecialty->{
    _id,
    name,
    "slug": slug.current
  },
  commonConditions,
  order,
  isActive,
  isFeatured
`;

// Get all active specialties
export const getSpecialtiesQuery = groq`
  *[_type == "specialty" && isActive == true && parentSpecialty == null] | order(order asc, name asc) {
    ${specialtyFields},
    "subSpecialties": *[_type == "specialty" && isActive == true && parentSpecialty._ref == ^._id] | order(order asc, name asc) {
      ${specialtyFields}
    },
    "doctorCount": count(*[_type == "doctor" && isActive == true && specialty._ref == ^._id])
  }
`;

// Get featured specialties
export const getFeaturedSpecialtiesQuery = groq`
  *[_type == "specialty" && isActive == true && isFeatured == true] | order(order asc, name asc) [0...$limit] {
    ${specialtyFields},
    "doctorCount": count(*[_type == "doctor" && isActive == true && specialty._ref == ^._id])
  }
`;

// Get specialty by slug
export const getSpecialtyBySlugQuery = groq`
  *[_type == "specialty" && slug.current == $slug && isActive == true][0] {
    ${specialtyFields},
    "subSpecialties": *[_type == "specialty" && isActive == true && parentSpecialty._ref == ^._id] | order(order asc, name asc) {
      ${specialtyFields}
    },
    "doctorCount": count(*[_type == "doctor" && isActive == true && specialty._ref == ^._id]),
    "topDoctors": *[_type == "doctor" && isActive == true && specialty._ref == ^._id] | order(rating desc, reviewsCount desc) [0...6] {
      _id,
      name,
      "slug": slug.current,
      image,
      experienceYears,
      consultationFee,
      rating,
      reviewsCount,
      "primaryHospital": hospitals[isPrimary == true][0].hospital->{
        name,
        "address": address.city
      }
    }
  }
`;

// Get specialty with statistics
export const getSpecialtyStatsQuery = groq`
  *[_type == "specialty" && isActive == true] {
    _id,
    name,
    "slug": slug.current,
    "doctorCount": count(*[_type == "doctor" && isActive == true && specialty._ref == ^._id]),
    "hospitalCount": count(*[_type == "hospital" && isActive == true && ^._id in specialties[]._ref]),
    "avgConsultationFee": math::avg(*[_type == "doctor" && isActive == true && specialty._ref == ^._id].consultationFee)
  }
`;

// Search specialties
export const searchSpecialtiesQuery = groq`
  *[_type == "specialty" && isActive == true && (
    name match $searchTerm + "*" ||
    nameEn match $searchTerm + "*" ||
    description match $searchTerm + "*"
  )] | order(isFeatured desc, order asc) [0...$limit] {
    ${specialtyFields},
    "doctorCount": count(*[_type == "doctor" && isActive == true && specialty._ref == ^._id])
  }
`;
