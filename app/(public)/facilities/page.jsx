import { HeroSection } from "@/components/shared/HeroSection";
import { SearchResults, BrowseView } from "./_components";
import { client } from "@/sanity/lib/client";
import {
    getFacilitiesQuery,
    getFeaturedFacilitiesQuery,
    getFacilitiesByTypeQuery
} from "@/sanity/queries/facilities";
import { applyFilters, getUniqueCities } from "@/lib/utils/filterUtils";
import { getActivePromotionalBanners } from "@/services/sanity/promotionalBanners";

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
                    <SearchResults 
                        data={data} 
                        params={params} 
                        sortOptions={sortOptions} 
                    />
                ) : (
                    <BrowseView 
                        data={data} 
                        steps={FACILITY_STEPS} 
                    />
                )}
            </main>
        </div>
    );
}



