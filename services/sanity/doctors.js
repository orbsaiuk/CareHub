import { writeClient as client } from '@/sanity/lib/serverClient';
import {
    getDoctorsQuery,
    getDoctorsCountQuery,
    getDoctorBySlugQuery,
    getDoctorByClerkIdQuery,
    getFeaturedDoctorsQuery,
    getDoctorsBySpecialtyQuery,
    getDoctorsByFacilityQuery,
    searchDoctorsQuery,
    getTopRatedDoctorsQuery,
    getFilteredDoctorsQuery,
    searchDoctorsWithFiltersQuery,
    searchDoctorsWithFiltersCountQuery,
} from '@/sanity/queries/doctors';

/**
 * Search doctors with multiple filters
 */
export async function searchDoctorsWithFilters(filters = {}, page = 1, limit = 12) {
    const start = (page - 1) * limit;
    const end = start + limit;

    const params = {
        searchTerm: filters.searchTerm || "",
        specialtyName: filters.specialtyName || filters.specialtySlug || filters.specialtyId || "", // Support all variants
        city: filters.city || "",
        start,
        end,
    };

    try {
        const [doctors, total] = await Promise.all([
            client.fetch(searchDoctorsWithFiltersQuery, params),
            client.fetch(searchDoctorsWithFiltersCountQuery, params),
        ]);

        return {
            doctors,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    } catch (error) {
        console.error('Error searching doctors with filters:', error);
        return { doctors: [], total: 0, page, limit, totalPages: 0 };
    }
}


/**
 * Get all doctors with pagination
 */
export async function getDoctors(page = 1, limit = 12) {
    const start = (page - 1) * limit;
    const end = start + limit;

    try {
        const [doctors, total] = await Promise.all([
            client.fetch(getDoctorsQuery, { start, end }),
            client.fetch(getDoctorsCountQuery),
        ]);

        return {
            doctors,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    } catch (error) {
        console.error('Error fetching doctors:', error);
        return { doctors: [], total: 0, page, limit, totalPages: 0 };
    }
}

/**
 * Get doctor by slug
 */
export async function getDoctorBySlug(slug) {
    try {
        return await client.fetch(getDoctorBySlugQuery, { slug });
    } catch (error) {
        console.error('Error fetching doctor by slug:', error);
        return null;
    }
}

/**
 * Get doctor by Clerk user ID
 */
export async function getDoctorByClerkId(clerkUserId) {
    try {
        return await client.fetch(getDoctorByClerkIdQuery, { clerkUserId });
    } catch (error) {
        console.error('Error fetching doctor by Clerk ID:', error);
        return null;
    }
}

/**
 * Get featured doctors
 */
export async function getFeaturedDoctors(limit = 8) {
    try {
        return await client.fetch(getFeaturedDoctorsQuery, { limit });
    } catch (error) {
        console.error('Error fetching featured doctors:', error);
        return [];
    }
}

/**
 * Get doctors by specialty
 */
export async function getDoctorsBySpecialty(specialtyId, page = 1, limit = 12) {
    const start = (page - 1) * limit;
    const end = start + limit;

    try {
        return await client.fetch(getDoctorsBySpecialtyQuery, { specialtyId, start, end });
    } catch (error) {
        console.error('Error fetching doctors by specialty:', error);
        return [];
    }
}

/**
 * Get doctors by facility
 */
export async function getDoctorsByFacility(facilityId, page = 1, limit = 12) {
    const start = (page - 1) * limit;
    const end = start + limit;

    try {
        return await client.fetch(getDoctorsByFacilityQuery, { facilityId, start, end });
    } catch (error) {
        console.error('Error fetching doctors by facility:', error);
        return [];
    }
}

/**
 * Search doctors
 */
export async function searchDoctors(searchTerm, limit = 20) {
    try {
        return await client.fetch(searchDoctorsQuery, { searchTerm, limit });
    } catch (error) {
        console.error('Error searching doctors:', error);
        return [];
    }
}

/**
 * Get top rated doctors
 */
export async function getTopRatedDoctors(limit = 10) {
    try {
        return await client.fetch(getTopRatedDoctorsQuery, { limit });
    } catch (error) {
        console.error('Error fetching top rated doctors:', error);
        return [];
    }
}

/**
 * Get filtered doctors
 */
export async function getFilteredDoctors(filters = {}, page = 1, limit = 12) {
    const start = (page - 1) * limit;
    const end = start + limit;

    const params = {
        specialtyId: filters.specialtyId || null,
        facilityId: filters.facilityId || null,
        minFee: filters.minFee || null,
        maxFee: filters.maxFee || null,
        start,
        end,
    };

    try {
        return await client.fetch(getFilteredDoctorsQuery, params);
    } catch (error) {
        console.error('Error fetching filtered doctors:', error);
        return [];
    }
}

/**
 * Create or update doctor profile
 */
export async function upsertDoctor(doctorData) {
    try {
        const { _id, ...data } = doctorData;

        if (_id) {
            // Update existing doctor
            return await client
                .patch(_id)
                .set(data)
                .commit();
        } else {
            // Create new doctor
            return await client.create({
                _type: 'doctor',
                ...data,
            });
        }
    } catch (error) {
        console.error('Error upserting doctor:', error);
        throw error;
    }
}

/**
 * Update doctor rating
 */
export async function updateDoctorRating(doctorId, newRating, reviewsCount) {
    try {
        return await client
            .patch(doctorId)
            .set({
                rating: newRating,
                reviewsCount: reviewsCount,
            })
            .commit();
    } catch (error) {
        console.error('Error updating doctor rating:', error);
        throw error;
    }
}
