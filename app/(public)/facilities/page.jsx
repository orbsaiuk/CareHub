import { SortDropdown } from "@/components/shared/SortDropdown";
import { PaginationWrapper } from "@/components/shared/PaginationWrapper";
import { HeroSection } from "@/components/shared/HeroSection";
import { FeatureSteps } from "@/components/shared/FeatureSteps";
import { PromotionalBanner } from "@/components/shared/PromotionalBanner";
import { FacilitiesGrid, FacilitiesNoResults, FacilitiesSection } from "./_components";
import { client } from "@/sanity/lib/client";
import {
    getFacilitiesQuery,
    getFeaturedFacilitiesQuery,
    getFacilitiesByTypeQuery
} from "@/sanity/queries/facilities";
import { applyFilters, getUniqueCities } from "@/lib/utils/filterUtils";
import { getActivePromotionalBanners } from "@/services/sanity/promotionalBanners";
import Link from "next/link";
import { X } from "lucide-react";

const ITEMS_PER_PAGE = 12;

export const metadata = {
    title: "المستشفيات والعيادات - منشآت طبية معتمدة",
    description: "منشآت طبية معتمدة بأحدث التجهيزات والكوادر الطبية المتميزة",
};

const sortOptions = [
    { value: "newest", label: "الأحدث" },
    { value: "rating-high", label: "الأعلى تقييماً" },
];

const facilityTypes = [
    { value: "مستشفى", label: "مستشفى", internal: "hospital" },
    { value: "عيادة", label: "عيادة", internal: "clinic" },
];

async function getFacilitiesData(searchParams) {
    try {
        const page = parseInt(searchParams.page || "1");

        // Fetch base data
        const allFacilities = await client.fetch(getFacilitiesQuery, { start: 0, end: 1000 });
        const cities = getUniqueCities(allFacilities);

        // Check if we are in "Search Mode"
        const isSearchMode =
            searchParams.search ||
            searchParams.type ||
            searchParams.city ||
            searchParams.page;

        if (isSearchMode) {
            // Map Arabic type value back to internal Sanity value
            const internalTypeValue = facilityTypes.find(t => t.value === searchParams.type)?.internal;

            // APPLY FILTERS
            const filters = {
                search: searchParams.search,
                city: searchParams.city,
                type: internalTypeValue || searchParams.type, // Fallback to raw param just in case
                sort: searchParams.sort || "newest",
                page: page,
                itemsPerPage: ITEMS_PER_PAGE,
                searchFields: ["name", "description", "address.city"]
            };

            const result = applyFilters(allFacilities, filters);

            return {
                isSearchMode: true,
                facilities: result.items,
                totalPages: result.totalPages,
                totalCount: result.totalItems,
                currentPage: page,
                cities
            };
        } else {
            // BROWSE MODE DATA
            const [featuredFacilities, clinics, banners] = await Promise.all([
                client.fetch(getFeaturedFacilitiesQuery, { limit: 6 }),
                client.fetch(getFacilitiesByTypeQuery, { type: "clinic", start: 0, end: 6 }),
                getActivePromotionalBanners("all")
            ]);

            return {
                isSearchMode: false,
                featuredFacilities,
                clinics,
                banners,
                cities
            };
        }
    } catch (error) {
        console.error("Error fetching facilities:", error);
        return {
            isSearchMode: true,
            facilities: [],
            totalPages: 0,
            cities: []
        };
    }
}

const FACILITY_STEPS = [
    {
        title: "اختر المنشآة",
        description: "تصفح قائمة المستشفيات والعيادات المتميزة"
    },
    {
        title: "تحقق من الخدمات",
        description: "اطلع على التخصصات والخدمات المتاحة"
    },
    {
        title: "احجز موعدك",
        description: "تواصل مباشرة واحجز موعدك بسهولة"
    }
];

export default async function FacilitiesPage({ searchParams }) {
    const params = await searchParams;
    const data = await getFacilitiesData(params);

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 font-sans" dir="rtl">
            {/* Hero & Search Section */}
            <HeroSection
                title="المستشفيات والعيادات"
                subtitle="منشآت طبية معتمدة بأحدث التجهيزات والكوادر الطبية المتميزة"
                categories={facilityTypes}
                categoryKey="type"
                categoryLabel="نوع المنشأة"
                allCategoriesLabel="جميع المنشآت"
                cities={data.cities}
                searchPlaceholder="اكتب اسم المستشفى أو العيادة..."
                baseSearchUrl="/facilities"
            />

            {/* Content Section */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">

                {data.isSearchMode ? (
                    // --- SEARCH RESULTS VIEW ---
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Search Header */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 pb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {params.search
                                        ? `نتائج البحث عن "${params.search}"`
                                        : params.type === "مستشفى"
                                            ? "المستشفيات"
                                            : params.type === "عيادة"
                                                ? "العيادات"
                                                : "نتائج البحث"}
                                </h2>
                                <p className="text-gray-500 mt-1">
                                    {data.totalCount > 0
                                        ? (() => {
                                            const count = data.totalCount;
                                            let word;

                                            if (params.type === "مستشفى") {
                                                word = count === 1 ? "مستشفى واحد" : count === 2 ? "مستشفيان" : `${count} مستشفى`;
                                            } else if (params.type === "عيادة") {
                                                word = count === 1 ? "عيادة واحدة" : count === 2 ? "عيادتان" : `${count} عيادة`;
                                            } else {
                                                word = count === 1 ? "منشأة طبية واحدة" : count === 2 ? "منشأتان طبيتان" : `${count} منشأة طبية`;
                                            }

                                            return `تم العثور على ${word}`;
                                        })()
                                        : "لم يتم العثور على نتائج"
                                    }
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <SortDropdown sortOptions={sortOptions} />
                                <Link
                                    href="/facilities"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    مسح الفلاتر
                                </Link>
                            </div>
                        </div>

                        {data.facilities.length > 0 ? (
                            <>
                                <FacilitiesGrid facilities={data.facilities} />
                                {data.totalPages > 1 && (
                                    <PaginationWrapper
                                        currentPage={data.currentPage}
                                        totalPages={data.totalPages}
                                    />
                                )}
                            </>
                        ) : (
                            <FacilitiesNoResults />
                        )}
                    </div>
                ) : (
                    // --- BROWSE / DEFAULT VIEW ---
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Feature Steps */}
                        <FeatureSteps steps={FACILITY_STEPS} />

                        {/* Featured Facilities */}
                        <FacilitiesSection
                            title="المنشآت المميزة"
                            facilities={data.featuredFacilities}
                            link="/facilities"
                        />

                        {/* Banner 1 */}
                        {data.banners?.[0] && (
                            <PromotionalBanner
                                image={data.banners[0].image}
                                ctaLink={data.banners[0].ctaLink}
                                title={data.banners[0].title}
                            />
                        )}

                        {/* Clinics */}
                        <FacilitiesSection
                            title="العيادات"
                            facilities={data.clinics}
                            link="/facilities?type=عيادة"
                        />
                    </div>
                )}
            </main>
        </div>
    );
}



