import { writeClient as client } from '@/sanity/lib/serverClient';
import {
    getHospitalsQuery,
    getHospitalsCountQuery,
    getHospitalBySlugQuery,
    getHospitalByClerkIdQuery,
    getFeaturedHospitalsQuery,
    getHospitalsByTypeQuery,
    getHospitalsBySpecialtyQuery,
    searchHospitalsQuery,
    getEmergencyHospitalsQuery,
    getHospitalsByCityQuery,
    getFilteredHospitalsQuery,
} from '@/sanity/queries/hospitals';

export async function getHospitals(page = 1, limit = 12) {
    const start = (page - 1) * limit;
    const end = start + limit;

    try {
        const [hospitals, total] = await Promise.all([
            client.fetch(getHospitalsQuery, { start, end }),
            client.fetch(getHospitalsCountQuery),
        ]);

        return {
            hospitals,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        return { hospitals: [], total: 0, page, limit, totalPages: 0 };
    }
}

export async function getHospitalBySlug(slug) {
    try {
        return await client.fetch(getHospitalBySlugQuery, { slug });
    } catch (error) {
        console.error('Error fetching hospital by slug:', error);
        return null;
    }
}

export async function getHospitalByClerkId(clerkUserId) {
    try {
        return await client.fetch(getHospitalByClerkIdQuery, { clerkUserId });
    } catch (error) {
        console.error('Error fetching hospital by Clerk ID:', error);
        return null;
    }
}

export async function getFeaturedHospitals(limit = 8) {
    try {
        return await client.fetch(getFeaturedHospitalsQuery, { limit });
    } catch (error) {
        console.error('Error fetching featured hospitals:', error);
        return [];
    }
}

export async function getHospitalsByType(type, page = 1, limit = 12) {
    const start = (page - 1) * limit;
    const end = start + limit;

    try {
        return await client.fetch(getHospitalsByTypeQuery, { type, start, end });
    } catch (error) {
        console.error('Error fetching hospitals by type:', error);
        return [];
    }
}

export async function getHospitalsBySpecialty(specialtyId, page = 1, limit = 12) {
    const start = (page - 1) * limit;
    const end = start + limit;

    try {
        return await client.fetch(getHospitalsBySpecialtyQuery, { specialtyId, start, end });
    } catch (error) {
        console.error('Error fetching hospitals by specialty:', error);
        return [];
    }
}

export async function searchHospitals(searchTerm, limit = 20) {
    try {
        return await client.fetch(searchHospitalsQuery, { searchTerm, limit });
    } catch (error) {
        console.error('Error searching hospitals:', error);
        return [];
    }
}

export async function getEmergencyHospitals(limit = 10) {
    try {
        return await client.fetch(getEmergencyHospitalsQuery, { limit });
    } catch (error) {
        console.error('Error fetching emergency hospitals:', error);
        return [];
    }
}

export async function getHospitalsByCity(city, page = 1, limit = 12) {
    const start = (page - 1) * limit;
    const end = start + limit;

    try {
        return await client.fetch(getHospitalsByCityQuery, { city, start, end });
    } catch (error) {
        console.error('Error fetching hospitals by city:', error);
        return [];
    }
}

export async function getFilteredHospitals(filters = {}, page = 1, limit = 12) {
    const start = (page - 1) * limit;
    const end = start + limit;

    const params = {
        type: filters.type || null,
        specialtyId: filters.specialtyId || null,
        city: filters.city || null,
        start,
        end,
    };

    try {
        return await client.fetch(getFilteredHospitalsQuery, params);
    } catch (error) {
        console.error('Error fetching filtered hospitals:', error);
        return [];
    }
}

export async function upsertHospital(hospitalData) {
    try {
        const { _id, ...data } = hospitalData;

        if (_id) {
            return await client.patch(_id).set(data).commit();
        } else {
            return await client.create({
                _type: 'hospital',
                ...data,
            });
        }
    } catch (error) {
        console.error('Error upserting hospital:', error);
        throw error;
    }
}

export async function updateHospitalRating(hospitalId, newRating, reviewsCount) {
    try {
        return await client
            .patch(hospitalId)
            .set({
                rating: newRating,
                reviewsCount: reviewsCount,
            })
            .commit();
    } catch (error) {
        console.error('Error updating hospital rating:', error);
        throw error;
    }
}
