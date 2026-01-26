"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

/**
 * Custom hook for managing filters, search, and sorting
 */
export function useFilters(defaultFilters = {}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize filters from URL params
    const [filters, setFilters] = useState(() => {
        const initial = { ...defaultFilters };
        searchParams.forEach((value, key) => {
            initial[key] = value;
        });
        return initial;
    });

    // Update URL when filters change
    const updateURL = useCallback((newFilters) => {
        const params = new URLSearchParams();

        Object.entries(newFilters).forEach(([key, value]) => {
            if (value && value !== "" && value !== defaultFilters[key]) {
                params.set(key, value);
            }
        });

        const queryString = params.toString();
        const newURL = queryString ? `${pathname}?${queryString}` : pathname;
        router.push(newURL);
    }, [pathname, router, defaultFilters]);

    // Update a single filter
    const updateFilter = useCallback((key, value) => {
        setFilters(prev => {
            const updated = { ...prev, [key]: value };
            updateURL(updated);
            return updated;
        });
    }, [updateURL]);

    // Update multiple filters at once
    const updateFilters = useCallback((updates) => {
        setFilters(prev => {
            const updated = { ...prev, ...updates };
            updateURL(updated);
            return updated;
        });
    }, [updateURL]);

    // Clear all filters
    const clearFilters = useCallback(() => {
        setFilters(defaultFilters);
        router.push(pathname);
    }, [defaultFilters, pathname, router]);

    // Clear a specific filter
    const clearFilter = useCallback((key) => {
        setFilters(prev => {
            const updated = { ...prev, [key]: defaultFilters[key] || "" };
            updateURL(updated);
            return updated;
        });
    }, [defaultFilters, updateURL]);

    // Check if any filters are active
    const hasActiveFilters = Object.entries(filters).some(
        ([key, value]) => value && value !== "" && value !== defaultFilters[key]
    );

    // Get active filters count
    const activeFiltersCount = Object.entries(filters).filter(
        ([key, value]) => value && value !== "" && value !== defaultFilters[key]
    ).length;

    return {
        filters,
        updateFilter,
        updateFilters,
        clearFilters,
        clearFilter,
        hasActiveFilters,
        activeFiltersCount
    };
}

/**
 * Hook for managing search functionality
 */
export function useSearch(onSearch) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = useCallback(async (term) => {
        setIsSearching(true);
        try {
            if (onSearch) {
                await onSearch(term);
            }
        } finally {
            setIsSearching(false);
        }
    }, [onSearch]);

    const clearSearch = useCallback(() => {
        setSearchTerm("");
        handleSearch("");
    }, [handleSearch]);

    return {
        searchTerm,
        setSearchTerm,
        handleSearch,
        clearSearch,
        isSearching
    };
}

/**
 * Hook for managing sorting
 */
export function useSort(defaultSort = "newest") {
    const [sortBy, setSortBy] = useState(defaultSort);
    const [sortOrder, setSortOrder] = useState("desc");

    const toggleSortOrder = useCallback(() => {
        setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    }, []);

    const updateSort = useCallback((newSort) => {
        setSortBy(newSort);
    }, []);

    return {
        sortBy,
        sortOrder,
        setSortBy: updateSort,
        setSortOrder,
        toggleSortOrder
    };
}

/**
 * Hook for managing pagination
 */
export function usePagination(totalItems, itemsPerPage = 10) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentPage = parseInt(searchParams.get("page") || "1");
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const goToPage = useCallback((page) => {
        const params = new URLSearchParams(searchParams);
        if (page > 1) {
            params.set("page", page.toString());
        } else {
            params.delete("page");
        }
        router.push(`${pathname}?${params.toString()}`);
    }, [pathname, router, searchParams]);

    const nextPage = useCallback(() => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    }, [currentPage, totalPages, goToPage]);

    const prevPage = useCallback(() => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    }, [currentPage, goToPage]);

    return {
        currentPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
    };
}
