"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function SortDropdown({ sortOptions = [] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [selectedSort, setSelectedSort] = useState(searchParams.get("sort") || "newest");
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSortChange = (sortValue) => {
        const params = new URLSearchParams(searchParams);

        if (sortValue && sortValue !== "newest") {
            params.set("sort", sortValue);
        } else {
            params.delete("sort");
        }

        params.set("page", "1"); // Reset to first page

        router.push(`${pathname}?${params.toString()}`);
        setSelectedSort(sortValue);
        setShowDropdown(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setShowDropdown(false);

        if (showDropdown) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showDropdown]);

    if (!sortOptions || sortOptions.length === 0) return null;

    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full border border-gray-200 shadow-sm text-sm text-gray-600 hover:border-primary/30 hover:shadow-md transition-all"
            >
                <span>الترتيب:</span>
                <span className="font-semibold text-gray-900">
                    {sortOptions.find(s => s.value === selectedSort)?.label || "الأحدث"}
                </span>
                <ChevronDown className="w-4 h-4" />
            </button>

            {showDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 min-w-[220px] z-50">
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={cn(
                                "w-full text-right px-4 py-3 hover:bg-gray-50 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl",
                                selectedSort === option.value
                                    ? "bg-blue-50 text-primary font-medium"
                                    : "text-gray-700"
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
