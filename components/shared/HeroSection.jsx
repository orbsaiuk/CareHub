"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroSection({
    title,
    subtitle,
    categories = [],
    categoryKey = "specialty",
    categoryLabel = "التخصص",
    allCategoriesLabel = "جميع التخصصات",
    cities = [],
    searchPlaceholder = "ابحث هنا...",
    baseSearchUrl = "/search",
    className
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State for form inputs
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    // Initialize state from URL params only on mount or when params change
    useEffect(() => {
        setSearchTerm(searchParams.get("search") || "");
        setSelectedCategory(searchParams.get(categoryKey) || "");
        setSelectedCity(searchParams.get("city") || "");
    }, [searchParams, categoryKey]);

    // State for dropdowns
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);

    // Get the display name for selected category
    const getCategoryDisplayName = useCallback(() => {
        if (!selectedCategory) return allCategoriesLabel;
        // Try to find the label if category object, otherwise return the value
        const found = categories.find(c => (c.name || c.value) === selectedCategory);
        return found ? (found.label || found.name) : selectedCategory;
    }, [selectedCategory, categories, allCategoriesLabel]);

    // Handle search submission
    const handleSearch = () => {
        const params = new URLSearchParams();

        if (searchTerm.trim()) {
            params.set("search", searchTerm.trim());
        }

        if (selectedCategory) {
            params.set(categoryKey, selectedCategory);
        }

        if (selectedCity) {
            params.set("city", selectedCity);
        }

        params.set("page", "1");

        // Navigate to search results
        router.push(`${baseSearchUrl}?${params.toString()}`);
    };

    // Handle Enter key press
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('[data-dropdown]')) {
                setShowCategoryDropdown(false);
                setShowCityDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Handle category selection
    const handleSelectCategory = (categoryValue) => {
        setSelectedCategory(categoryValue);
        setShowCategoryDropdown(false);
    };

    // Handle city selection
    const handleSelectCity = (city) => {
        setSelectedCity(city);
        setShowCityDropdown(false);
    };

    // Clear category
    const clearCategory = (e) => {
        e.stopPropagation();
        setSelectedCategory("");
    };

    // Clear city
    const clearCity = (e) => {
        e.stopPropagation();
        setSelectedCity("");
    };

    return (
        <div className={cn("relative bg-primary/10 pt-24 pb-32 px-4", className)} dir="rtl">

            {/* Hero Content */}
            <div className="max-w-4xl mx-auto text-center space-y-4 mb-10 relative z-10">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent tracking-tight leading-tight">
                    {title}
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    {subtitle}
                </p>
            </div>

            {/* Floating Search Bar */}
            <div className="max-w-4xl mx-auto relative">
                <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row items-stretch md:items-center gap-2 border border-blue-100/50 relative">
                    {/* Search Input */}
                    <div className="flex-1 relative flex items-center px-4 bg-gray-50/50 rounded-xl md:bg-transparent md:rounded-none">
                        <Search className="w-5 h-5 text-gray-400 ml-3 flex-shrink-0" />
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={searchPlaceholder}
                            className="border-none shadow-none focus-visible:ring-0 bg-transparent text-gray-800 placeholder:text-gray-400 h-12 text-base w-full"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                                aria-label="مسح البحث"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-8 bg-gray-200 mx-1"></div>

                    {/* Category Dropdown */}
                    <div className="relative" data-dropdown>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowCategoryDropdown(!showCategoryDropdown);
                                setShowCityDropdown(false);
                            }}
                            className="relative flex items-center justify-between px-4 cursor-pointer hover:bg-gray-50 rounded-xl transition-all h-12 md:w-52 group w-full"
                        >
                            <span className={cn(
                                "text-sm truncate",
                                selectedCategory ? "text-gray-900 font-medium" : "text-gray-500"
                            )}>
                                {getCategoryDisplayName()}
                            </span>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                {selectedCategory && (
                                    <button
                                        onClick={clearCategory}
                                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                        aria-label={`مسح ${categoryLabel}`}
                                    >
                                        <X className="w-3 h-3 text-gray-400" />
                                    </button>
                                )}
                                <ChevronDown className={cn(
                                    "w-4 h-4 text-gray-400 transition-transform duration-200",
                                    showCategoryDropdown && "rotate-180"
                                )} />
                            </div>
                        </button>

                        {/* Category Dropdown Menu */}
                        {showCategoryDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-72 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
                                <button
                                    onClick={() => handleSelectCategory("")}
                                    className={cn(
                                        "w-full text-right px-4 py-3 hover:bg-gray-50 text-sm transition-colors border-b border-gray-100",
                                        !selectedCategory ? "bg-blue-50 text-primary font-medium" : "text-gray-700"
                                    )}
                                >
                                    {allCategoriesLabel}
                                </button>
                                {categories.map((category) => {
                                    const value = category.value || category.name;
                                    const label = category.label || category.name;
                                    return (
                                        <button
                                            key={category._id || category.id || value}
                                            onClick={() => handleSelectCategory(value)}
                                            className={cn(
                                                "w-full text-right px-4 py-3 hover:bg-gray-50 text-sm transition-colors flex items-center gap-3",
                                                selectedCategory === value
                                                    ? "bg-blue-50 text-primary font-medium"
                                                    : "text-gray-700"
                                            )}
                                        >
                                            <span className="flex-1">{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-8 bg-gray-200 mx-1"></div>

                    {/* Location Dropdown */}
                    <div className="relative" data-dropdown>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowCityDropdown(!showCityDropdown);
                                setShowCategoryDropdown(false);
                            }}
                            className="relative flex items-center justify-between px-4 cursor-pointer hover:bg-gray-50 rounded-xl transition-all h-12 md:w-44 group w-full"
                        >
                            <div className="flex items-center gap-2">
                                <MapPin className={cn(
                                    "w-4 h-4 transition-colors flex-shrink-0",
                                    selectedCity ? "text-primary" : "text-gray-400 group-hover:text-primary"
                                )} />
                                <span className={cn(
                                    "text-sm truncate",
                                    selectedCity ? "text-gray-900 font-medium" : "text-gray-500"
                                )}>
                                    {selectedCity || "اختر المدينة"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                {selectedCity && (
                                    <button
                                        onClick={clearCity}
                                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                        aria-label="مسح المدينة"
                                    >
                                        <X className="w-3 h-3 text-gray-400" />
                                    </button>
                                )}
                                <ChevronDown className={cn(
                                    "w-4 h-4 text-gray-400 transition-transform duration-200",
                                    showCityDropdown && "rotate-180"
                                )} />
                            </div>
                        </button>

                        {/* City Dropdown Menu */}
                        {showCityDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-72 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
                                <button
                                    onClick={() => handleSelectCity("")}
                                    className={cn(
                                        "w-full text-right px-4 py-3 hover:bg-gray-50 text-sm transition-colors border-b border-gray-100",
                                        !selectedCity ? "bg-blue-50 text-primary font-medium" : "text-gray-700"
                                    )}
                                >
                                    جميع المدن
                                </button>
                                {cities.map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => handleSelectCity(city)}
                                        className={cn(
                                            "w-full text-right px-4 py-3 hover:bg-gray-50 text-sm transition-colors",
                                            selectedCity === city
                                                ? "bg-blue-50 text-primary font-medium"
                                                : "text-gray-700"
                                        )}
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search Button */}
                    <Button
                        onClick={handleSearch}
                        className="h-12 px-8 rounded-xl bg-primary hover:from-blue-700 hover:to-blue-600 text-white font-bold text-base active:scale-95 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                    >
                        <Search className="w-4 h-4 ml-2" />
                        بحث
                    </Button>
                </div>
            </div>
        </div>
    );
}
