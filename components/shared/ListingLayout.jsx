"use client";

import { useRef } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { Pagination } from "./Pagination";

export function ListingLayout({
    title,
    subtitle,
    searchPlaceholder = "ابحث هنا...",
    sectionTitle,
    sectionSubtitle = "اختر من بين نخبة من المتميزين في هذا المجال",
    children,
    className,
    currentPage,
    totalPages,
    onPageChange,
    showPagination = true
}) {
    const contentRef = useRef(null);

    const handlePageChange = (page) => {
        // Always scroll to content section, even if page doesn't change
        if (contentRef.current) {
            const yOffset = -20; // 20px offset from top
            const y = contentRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
        // Update page state
        onPageChange?.(page);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 font-sans" dir="rtl">
            {/* Hero & Search Section */}
            <div className="relative bg-primary/10 pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-4 mb-10">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
                        {title}
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </div>

                {/* Floating Search Bar */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row items-stretch md:items-center gap-2 border border-blue-50 relative z-10">

                        {/* Search Input */}
                        <div className="flex-1 relative flex items-center px-4 bg-gray-50/50 rounded-xl md:bg-transparent md:rounded-none">
                            <Search className="w-5 h-5 text-gray-400 ml-3" />
                            <Input
                                type="text"
                                placeholder={searchPlaceholder}
                                className="border-none shadow-none focus-visible:ring-0 bg-transparent text-gray-800 placeholder:text-gray-400 h-12 text-base w-full"
                            />
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-8 bg-gray-200 mx-2"></div>

                        {/* Specialty/Category Dropdown (Mock) */}
                        <div className="relative flex items-center px-4 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors h-12 md:w-48 group">
                            <span className="text-gray-500 text-sm ml-auto">جميع التخصصات</span>
                            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-8 bg-gray-200 mx-2"></div>

                        {/* Location Dropdown (Mock) */}
                        <div className="relative flex items-center px-4 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors h-12 md:w-48 group">
                            <MapPin className="w-4 h-4 text-gray-400 ml-2 group-hover:text-primary transition-colors" />
                            <span className="text-gray-500 text-sm ml-auto">اختر المدينة</span>
                            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                        </div>

                        {/* Search Button */}
                        <Button className="h-12 px-8 rounded-xl bg-blue-500 hover:bg-primary text-white font-bold text-base active:scale-95">
                            بحث
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <main ref={contentRef} className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {/* Feature Badges */}
                <div className="flex flex-wrap justify-center gap-6 mb-12">
                    <div className="flex flex-col items-center text-center space-y-2 max-w-[200px]">
                        <div className="w-12 h-12 rounded-full bg-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            1
                        </div>
                        <h4 className="font-bold text-gray-900">نوع الطبيب</h4>
                        <p className="text-sm text-gray-500">اختر من بين الأطباء العامين والمتخصصين</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-2 max-w-[200px]">
                        <div className="w-12 h-12 rounded-full bg-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            2
                        </div>
                        <h4 className="font-bold text-gray-900">قيم الطبيب</h4>
                        <p className="text-sm text-gray-500">قيمون تجاربك مع الأطباء</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-2 max-w-[200px]">
                        <div className="w-12 h-12 rounded-full bg-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            3
                        </div>
                        <h4 className="font-bold text-gray-900">احجز على الاستشارة</h4>
                        <p className="text-sm text-gray-500">النظام الطبي المتقدم والاستشاري</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-bold text-gray-900">{sectionTitle}</h2>
                        <p className="text-lg text-gray-500">{sectionSubtitle}</p>
                    </div>

                    {/* Sort Filter (Mock) */}
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm text-sm text-gray-600 cursor-pointer hover:border-blue-200 transition-colors">
                        <span>الترتيب حسب:</span>
                        <span className="font-semibold text-gray-900">الأحدث</span>
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>

                {/* Grid Content */}
                <div className={cn("space-y-6", className)}>
                    {children}
                </div>

                {/* Pagination */}
                {showPagination && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </main>
        </div>
    );
}
