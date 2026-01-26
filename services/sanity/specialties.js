import { writeClient as client } from '@/sanity/lib/serverClient';
import {
    getSpecialtiesQuery,
    getFeaturedSpecialtiesQuery,
    getSpecialtyBySlugQuery,
    getSpecialtyStatsQuery,
    searchSpecialtiesQuery,
} from '@/sanity/queries/specialties';

export async function getSpecialties() {
    try {
        return await client.fetch(getSpecialtiesQuery);
    } catch (error) {
        console.error('Error fetching specialties:', error);
        return [];
    }
}

export async function getFeaturedSpecialties(limit = 8) {
    try {
        return await client.fetch(getFeaturedSpecialtiesQuery, { limit });
    } catch (error) {
        console.error('Error fetching featured specialties:', error);
        return [];
    }
}

export async function getSpecialtyBySlug(slug) {
    try {
        return await client.fetch(getSpecialtyBySlugQuery, { slug });
    } catch (error) {
        console.error('Error fetching specialty by slug:', error);
        return null;
    }
}

export async function getSpecialtyById(id) {
    try {
        return await client.fetch(`*[_type == "specialty" && _id == $id][0]`, { id });
    } catch (error) {
        console.error('Error fetching specialty by id:', error);
        return null;
    }
}

export async function getSpecialtyStats() {
    try {
        return await client.fetch(getSpecialtyStatsQuery);
    } catch (error) {
        console.error('Error fetching specialty stats:', error);
        return [];
    }
}

export async function searchSpecialties(searchTerm, limit = 20) {
    try {
        return await client.fetch(searchSpecialtiesQuery, { searchTerm, limit });
    } catch (error) {
        console.error('Error searching specialties:', error);
        return [];
    }
}

export async function upsertSpecialty(specialtyData) {
    try {
        const { _id, ...data } = specialtyData;

        if (_id) {
            return await client.patch(_id).set(data).commit();
        } else {
            return await client.create({
                _type: 'specialty',
                ...data,
            });
        }
    } catch (error) {
        console.error('Error upserting specialty:', error);
        throw error;
    }
}
