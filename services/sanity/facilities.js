import { writeClient as client } from '@/sanity/lib/serverClient';
import {
    getFacilitiesQuery,
    getFacilitiesCountQuery,
    getFacilityBySlugQuery,
    getFacilityByClerkIdQuery,
    getFeaturedFacilitiesQuery,
    getFacilitiesByTypeQuery,
    getFacilitiesBySpecialtyQuery,
    searchFacilitiesQuery,
    getEmergencyFacilitiesQuery,
    getFacilitiesByCityQuery,
    getFilteredFacilitiesQuery,
    getUniqueCitiesQuery,
} from '@/sanity/queries/facilities';

export async function getAllCities() {
    try {
        const cities = await client.fetch(getUniqueCitiesQuery);
        // Deduplicate and trim in JS for robustness against inconsistent data entry
        const uniqueCities = Array.from(new Set(cities.filter(Boolean).map(c => c.trim())));
        return uniqueCities.sort((a, b) => a.localeCompare(b, 'ar'));
    } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
}


export async function getFacilities(page = 1, limit = 12) {
    const start = (page - 1) * limit;
    const end = start + limit;

    try {
        const [facilities, total] = await Promise.all([
            client.fetch(getFacilitiesQuery, { start, end }),
            client.fetch(getFacilitiesCountQuery),
        ]);

        return {
            facilities,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    } catch (error) {
        console.error('Error fetching facilities:', error);
        return { facilities: [], total: 0, page, limit, totalPages: 0 };
    }
}

export async function getFacilityBySlug(slug) {
    try {
        return await client.fetch(getFacilityBySlugQuery, { slug });
    } catch (error) {
        console.error('Error fetching facility by slug:', error);
        return null;
    }
}

export async function getFacilityByClerkId(clerkUserId) {
    try {
        return await client.fetch(getFacilityByClerkIdQuery, { clerkUserId });
    } catch (error) {
        console.error('Error fetching facility by Clerk ID:', error);
        return null;
    }
}

export async function getFeaturedFacilities(limit = 8) {
    try {
        return await client.fetch(getFeaturedFacilitiesQuery, { limit });
    } catch (error) {
        console.error('Error fetching featured facilities:', error);
        return [];
    }
}

export async function getFacilitiesByType(type, page = 1, limit = 12) {
    const start = (page - 1) * limit;
    const end = start + limit;

    try {
        return await client.fetch(getFacilitiesByTypeQuery, { type, start, end });
    } catch (error) {
        console.error('Error fetching facilities by type:', error);
        return [];
    }
}

export async function getFacilitiesBySpecialty(specialtyId, page = 1, limit = 12) {
    const start = (page - 1) * limit;
    const end = start + limit;

    try {
        return await client.fetch(getFacilitiesBySpecialtyQuery, { specialtyId, start, end });
    } catch (error) {
        console.error('Error fetching facilities by specialty:', error);
        return [];
    }
}

export async function searchFacilities(searchTerm, limit = 20) {
    try {
        return await client.fetch(searchFacilitiesQuery, { searchTerm, limit });
    } catch (error) {
        console.error('Error searching facilities:', error);
        return [];
    }
}

export async function getEmergencyFacilities(limit = 10) {
    try {
        return await client.fetch(getEmergencyFacilitiesQuery, { limit });
    } catch (error) {
        console.error('Error fetching emergency facilities:', error);
        return [];
    }
}

export async function getFacilitiesByCity(city, page = 1, limit = 12) {
    const start = (page - 1) * limit;
    const end = start + limit;

    try {
        return await client.fetch(getFacilitiesByCityQuery, { city, start, end });
    } catch (error) {
        console.error('Error fetching facilities by city:', error);
        return [];
    }
}

export async function getFilteredFacilities(filters = {}, page = 1, limit = 12) {
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
        return await client.fetch(getFilteredFacilitiesQuery, params);
    } catch (error) {
        console.error('Error fetching filtered facilities:', error);
        return [];
    }
}

export async function upsertFacility(facilityData) {
    try {
        const { _id, ...data } = facilityData;

        if (_id) {
            return await client.patch(_id).set(data).commit();
        } else {
            return await client.create({
                _type: 'facility',
                ...data,
            });
        }
    } catch (error) {
        console.error('Error upserting facility:', error);
        throw error;
    }
}

export async function updateFacilityRating(facilityId, newRating, reviewsCount) {
    try {
        return await client
            .patch(facilityId)
            .set({
                rating: newRating,
                reviewsCount: reviewsCount,
            })
            .commit();
    } catch (error) {
        console.error('Error updating facility rating:', error);
        throw error;
    }
}
