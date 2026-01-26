import { groq } from 'next-sanity';

// Base appointment fields
export const appointmentFields = groq`
  _id,
  _createdAt,
  appointmentNumber,
  patient,
  "doctor": doctor->{
    _id,
    name,
    "slug": slug.current,
    title,
    image,
    "specialty": specialty->{name, icon},
    phone,
    email
  },
  "facility": facility->{
    _id,
    name,
    "slug": slug.current,
    logo,
    address,
    phone
  },
  "specialty": specialty->{
    _id,
    name,
    icon
  },
  appointmentDate,
  duration,
  type,
  reason,
  symptoms,
  status,
  cancellationReason,
  fee,
  paymentStatus,
  paymentMethod,
  insuranceInfo,
  notes,
  doctorNotes,
  prescription,
  followUpDate,
  reminderSent,
  updatedAt
`;

// Get appointments by patient (Clerk user ID)
export const getPatientAppointmentsQuery = groq`
  *[_type == "appointment" && patient.clerkUserId == $clerkUserId] | order(appointmentDate desc) [$start...$end] {
    ${appointmentFields}
  }
`;

// Get appointments by doctor
export const getDoctorAppointmentsQuery = groq`
  *[_type == "appointment" && doctor._ref == $doctorId] | order(appointmentDate desc) [$start...$end] {
    ${appointmentFields}
  }
`;

// Get appointments by facility
export const getFacilityAppointmentsQuery = groq`
  *[_type == "appointment" && facility._ref == $facilityId] | order(appointmentDate desc) [$start...$end] {
    ${appointmentFields}
  }
`;

// Get appointment by ID
export const getAppointmentByIdQuery = groq`
  *[_type == "appointment" && _id == $appointmentId][0] {
    ${appointmentFields}
  }
`;

// Get upcoming appointments for patient
export const getUpcomingPatientAppointmentsQuery = groq`
  *[_type == "appointment" 
    && patient.clerkUserId == $clerkUserId 
    && appointmentDate > now()
    && status in ["pending", "confirmed"]
  ] | order(appointmentDate asc) [0...$limit] {
    ${appointmentFields}
  }
`;

// Get upcoming appointments for doctor
export const getUpcomingDoctorAppointmentsQuery = groq`
  *[_type == "appointment" 
    && doctor._ref == $doctorId 
    && appointmentDate > now()
    && status in ["pending", "confirmed"]
  ] | order(appointmentDate asc) [0...$limit] {
    ${appointmentFields}
  }
`;

// Get appointments by date range
export const getAppointmentsByDateRangeQuery = groq`
  *[_type == "appointment" 
    && appointmentDate >= $startDate 
    && appointmentDate <= $endDate
    && ($doctorId == null || doctor._ref == $doctorId)
    && ($facilityId == null || facility._ref == $facilityId)
  ] | order(appointmentDate asc) {
    ${appointmentFields}
  }
`;

// Get appointments by status
export const getAppointmentsByStatusQuery = groq`
  *[_type == "appointment" 
    && status == $status
    && ($doctorId == null || doctor._ref == $doctorId)
    && ($patientId == null || patient.clerkUserId == $patientId)
  ] | order(appointmentDate desc) [$start...$end] {
    ${appointmentFields}
  }
`;

// Get appointment statistics for doctor
export const getDoctorAppointmentStatsQuery = groq`
  {
    "total": count(*[_type == "appointment" && doctor._ref == $doctorId]),
    "completed": count(*[_type == "appointment" && doctor._ref == $doctorId && status == "completed"]),
    "cancelled": count(*[_type == "appointment" && doctor._ref == $doctorId && status == "cancelled"]),
    "upcoming": count(*[_type == "appointment" && doctor._ref == $doctorId && appointmentDate > now() && status in ["pending", "confirmed"]]),
    "totalRevenue": math::sum(*[_type == "appointment" && doctor._ref == $doctorId && paymentStatus == "paid"].fee)
  }
`;

// Get appointment statistics for facility
export const getFacilityAppointmentStatsQuery = groq`
  {
    "total": count(*[_type == "appointment" && facility._ref == $facilityId]),
    "completed": count(*[_type == "appointment" && facility._ref == $facilityId && status == "completed"]),
    "cancelled": count(*[_type == "appointment" && facility._ref == $facilityId && status == "cancelled"]),
    "upcoming": count(*[_type == "appointment" && facility._ref == $facilityId && appointmentDate > now() && status in ["pending", "confirmed"]]),
    "totalRevenue": math::sum(*[_type == "appointment" && facility._ref == $facilityId && paymentStatus == "paid"].fee)
  }
`;

// Check doctor availability for a specific date/time
export const checkDoctorAvailabilityQuery = groq`
  !defined(*[_type == "appointment" 
    && doctor._ref == $doctorId 
    && appointmentDate == $appointmentDate
    && status in ["pending", "confirmed", "in_progress"]
  ][0])
`;
