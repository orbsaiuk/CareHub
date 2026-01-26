"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, MapPin, ChevronDown, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export function SearchFilters({
    searchPlaceholder = "ابحث هنا...",
    showSpecialty = true,
    showLocation = true,
    specialties = [],
    cities = [],
    onSearch
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get("specialty") || "");
    const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");
    const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams);

        if (searchTerm) {
            params.set("search", searchTerm);
        } else {
            params.delete("search");
        }

        if (selectedSpecialty) {
            params.set("specialty", selectedSpecialty);
        } else {
            params.delete("specialty");
        }

        if (selectedCity) {
            params.set("city", selectedCity);
        } else {
            params.delete("city");
        }

        params.set("page", "1"); // Reset to first page

        router.push(`${pathname}?${params.toString()}`);
        if (onSearch) onSearch();
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedSpecialty("");
        setSelectedCity("");
        router.push(pathname);
    };

    const hasActiveFilters = searchTerm || selectedSpecialty || selectedCity;

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setShowSpecialtyDropdown(false);
            setShowCityDropdown(false);
        };

        if (showSpecialtyDropdown || showCityDropdown) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showSpecialtyDropdown, showCityDropdown]);

    return (
        <div className="space-y-4">
            {/* Main Search Bar */}
            <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row items-stretch md:items-center gap-2 border border-blue-50 relative z-10">
                {/* Search Input */}
                <div className="flex-1 relative flex items-center px-4 bg-gray-50/50 rounded-xl md:bg-transparent md:rounded-none">
                    <Search className="w-5 h-5 text-gray-400 ml-3" />
                    <Input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="border-none shadow-none focus-visible:ring-0 bg-transparent text-gray-800 placeholder:text-gray-400 h-12 text-base w-full"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    )}
                </div>

                {/* Specialty Dropdown */}
                {showSpecialty && specialties.length > 0 && (
                    <>
                        <div className="hidden md:block w-px h-8 bg-gray-200 mx-2"></div>
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => {
                                    setShowSpecialtyDropdown(!showSpecialtyDropdown);
                                    setShowCityDropdown(false);
                                }}
                                className="relative flex items-center px-4 hover:bg-gray-50 rounded-xl transition-colors h-12 md:w-48 group w-full"
                            >
                                <span className={cn(
                                    "text-sm ml-auto truncate",
                                    selectedSpecialty ? "text-gray-900 font-medium" : "text-gray-500"
                                )}>
                                    {selectedSpecialty
                                        ? specialties.find(s => s.value === selectedSpecialty)?.label
                                        : "جميع التخصصات"}
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                            </button>

                            {showSpecialtyDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-64 overflow-y-auto z-50">
                                    <button
                                        onClick={() => {
                                            setSelectedSpecialty("");
                                            setShowSpecialtyDropdown(false);
                                        }}
                                        className="w-full text-right px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 border-b"
                                    >
                                        جميع التخصصات
                                    </button>
                                    {specialties.map((specialty) => (
                                        <button
                                            key={specialty.value}
                                            onClick={() => {
                                                setSelectedSpecialty(specialty.value);
                                                setShowSpecialtyDropdown(false);
                                            }}
                                            className={cn(
                                                "w-full text-right px-4 py-3 hover:bg-gray-50 text-sm",
                                                selectedSpecialty === specialty.value
                                                    ? "bg-blue-50 text-primary font-medium"
                                                    : "text-gray-700"
                                            )}
                                        >
                                            {specialty.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Location Dropdown */}
                {showLocation && cities.length > 0 && (
                    <>
                        <div className="hidden md:block w-px h-8 bg-gray-200 mx-2"></div>
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => {
                                    setShowCityDropdown(!showCityDropdown);
                                    setShowSpecialtyDropdown(false);
                                }}
                                className="relative flex items-center px-4 hover:bg-gray-50 rounded-xl transition-colors h-12 md:w-48 group w-full"
                            >
                                <MapPin className="w-4 h-4 text-gray-400 ml-2 group-hover:text-primary transition-colors" />
                                <span className={cn(
                                    "text-sm ml-auto truncate",
                                    selectedCity ? "text-gray-900 font-medium" : "text-gray-500"
                                )}>
                                    {selectedCity || "جميع المدن"}
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                            </button>

                            {showCityDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-64 overflow-y-auto z-50">
                                    <button
                                        onClick={() => {
                                            setSelectedCity("");
                                            setShowCityDropdown(false);
                                        }}
                                        className="w-full text-right px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 border-b"
                                    >
                                        جميع المدن
                                    </button>
                                    {cities.map((city) => (
                                        <button
                                            key={city}
                                            onClick={() => {
                                                setSelectedCity(city);
                                                setShowCityDropdown(false);
                                            }}
                                            className={cn(
                                                "w-full text-right px-4 py-3 hover:bg-gray-50 text-sm",
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
                    </>
                )}

                {/* Search Button */}
                <Button
                    onClick={handleSearch}
                    className="h-12 px-8 rounded-xl bg-blue-500 hover:bg-primary text-white font-bold text-base active:scale-95"
                >
                    بحث
                </Button>
            </div>

            {/* Clear Filters and Active Filters */}
            {hasActiveFilters && (
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    {/* Clear Filters */}
                    <Button
                        onClick={handleClearFilters}
                        variant="ghost"
                        className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                        <X className="w-4 h-4 ml-2" />
                        مسح الفلاتر
                    </Button>
                </div>
            )}
        </div>
    );
}
