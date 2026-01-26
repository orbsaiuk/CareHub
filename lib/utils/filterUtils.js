/**
 * Utility functions for filtering, searching, and sorting data
 */

/**
 * Filter items based on search term
 */
export function filterBySearch(items, searchTerm, searchFields = []) {
    if (!searchTerm || !searchTerm.trim()) return items;

    const term = searchTerm.toLowerCase().trim();

    return items.filter(item => {
        return searchFields.some(field => {
            const value = getNestedValue(item, field);
            return value && value.toString().toLowerCase().includes(term);
        });
    });
}

/**
 * Filter items by a specific field value
 */
export function filterByField(items, fieldPath, value) {
    if (!value) return items;

    return items.filter(item => {
        const fieldValue = getNestedValue(item, fieldPath);
        return fieldValue === value || fieldValue?._id === value || fieldValue?.slug === value;
    });
}

/**
 * Sort items based on sort option
 */
export function sortItems(items, sortBy) {
    const sorted = [...items];

    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) =>
                new Date(b._createdAt || 0) - new Date(a._createdAt || 0)
            );

        case 'oldest':
            return sorted.sort((a, b) =>
                new Date(a._createdAt || 0) - new Date(b._createdAt || 0)
            );

        case 'rating-high':
            return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));

        case 'rating-low':
            return sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));

        case 'name-asc':
            return sorted.sort((a, b) =>
                (a.name || '').localeCompare(b.name || '', 'ar')
            );

        case 'name-desc':
            return sorted.sort((a, b) =>
                (b.name || '').localeCompare(a.name || '', 'ar')
            );

        case 'reviews':
            return sorted.sort((a, b) =>
                (b.reviewsCount || 0) - (a.reviewsCount || 0)
            );

        case 'experience':
            return sorted.sort((a, b) =>
                (b.experienceYears || 0) - (a.experienceYears || 0)
            );

        case 'featured':
            return sorted.sort((a, b) => {
                if (a.isFeatured && !b.isFeatured) return -1;
                if (!a.isFeatured && b.isFeatured) return 1;
                return (b.rating || 0) - (a.rating || 0);
            });

        default:
            return sorted;
    }
}

/**
 * Get nested object value by path (e.g., "specialty.name")
 */
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Extract unique values from array of objects for a specific field
 */
export function getUniqueValues(items, fieldPath) {
    const values = new Set();

    items.forEach(item => {
        const value = getNestedValue(item, fieldPath);
        if (value) {
            if (Array.isArray(value)) {
                value.forEach(v => {
                    const trimmed = typeof v === 'string' ? v.trim() : v;
                    if (trimmed) values.add(trimmed);
                });
            } else {
                const trimmed = typeof value === 'string' ? value.trim() : value;
                if (trimmed) values.add(trimmed);
            }
        }
    });

    return Array.from(values).sort((a, b) => {
        if (typeof a === 'string') {
            return a.localeCompare(b, 'ar');
        }
        return 0;
    });
}

/**
 * Extract unique cities from items with address
 */
export function getUniqueCities(items) {
    const cities = new Set();

    items.forEach(item => {
        const city = (item.address?.city || item.location?.city)?.trim();
        if (city) cities.add(city);
    });

    return Array.from(cities).sort((a, b) => a.localeCompare(b, 'ar'));
}

/**
 * Paginate items
 */
export function paginateItems(items, page = 1, itemsPerPage = 9) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return {
        items: items.slice(startIndex, endIndex),
        totalPages: Math.ceil(items.length / itemsPerPage),
        currentPage: page,
        totalItems: items.length
    };
}

/**
 * Apply all filters, search, and sort
 */
export function applyFilters(items, filters = {}) {
    let filtered = [...items];

    // Apply search
    if (filters.search) {
        filtered = filterBySearch(filtered, filters.search, filters.searchFields || ['name']);
    }

    // Apply field filters
    if (filters.specialty) {
        filtered = filterByField(filtered, 'specialty._id', filters.specialty);
    }

    if (filters.city) {
        filtered = filterByField(filtered, 'address.city', filters.city);
    }

    if (filters.type) {
        filtered = filterByField(filtered, 'type', filters.type);
    }

    // Apply custom filter function
    if (filters.customFilter && typeof filters.customFilter === 'function') {
        filtered = filtered.filter(filters.customFilter);
    }

    // Apply sorting
    if (filters.sort) {
        filtered = sortItems(filtered, filters.sort);
    }

    // Apply pagination
    if (filters.page && filters.itemsPerPage) {
        return paginateItems(filtered, filters.page, filters.itemsPerPage);
    }

    return {
        items: filtered,
        totalItems: filtered.length
    };
}
