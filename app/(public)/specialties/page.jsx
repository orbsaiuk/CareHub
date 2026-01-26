import { SpecialtyCard } from "@/components/cards/SpecialtyCard";
import { SearchFilters } from "@/components/shared/SearchFilters";
import { PaginationWrapper } from "@/components/shared/PaginationWrapper";
import { client } from "@/sanity/lib/client";
import { getSpecialtiesQuery } from "@/sanity/queries/specialties";
import { applyFilters } from "@/lib/utils/filterUtils";

const ITEMS_PER_PAGE = 12;

export const metadata = {
    title: "التخصصات الطبية - اختر التخصص المناسب",
    description: "اختر التخصص المناسب لحالتك الصحية من بين مختلف التخصصات الطبية المتاحة",
};

async function getSpecialtiesData(searchParams) {
    try {
        const allSpecialties = await client.fetch(getSpecialtiesQuery);

        // Apply filters
        const filters = {
            search: searchParams.search,
            page: parseInt(searchParams.page || "1"),
            itemsPerPage: ITEMS_PER_PAGE,
            searchFields: ["name", "nameEn", "description"]
        };

        const result = applyFilters(allSpecialties, filters);

        return {
            specialties: result.items,
            totalPages: result.totalPages
        };
    } catch (error) {
        console.error("Error fetching specialties:", error);
        return { specialties: [], totalPages: 0 };
    }
}

export default async function SpecialtiesPage({ searchParams }) {
    const params = await searchParams;
    const currentPage = parseInt(params?.page || "1");
    const { specialties, totalPages } = await getSpecialtiesData(params);

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 font-sans" dir="rtl">
            {/* Hero & Search Section */}
            <div className="relative bg-primary/10 pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-4 mb-10">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
                        التخصصات الطبية
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        اختر التخصص المناسب لحالتك الصحية
                    </p>
                </div>

                {/* Search Filters */}
                <div className="max-w-4xl mx-auto">
                    <SearchFilters
                        searchPlaceholder="ابحث عن تخصص طبي..."
                        showSpecialty={false}
                        showLocation={false}
                    />
                </div>
            </div>

            {/* Content Section */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {/* Results Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-bold text-gray-900">جميع التخصصات</h2>
                        <p className="text-lg text-gray-500">
                            عرض {specialties.length} من التخصصات الطبية
                        </p>
                    </div>
                </div>

                {/* Specialties Grid */}
                {specialties.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {specialties.map((specialty) => (
                                <SpecialtyCard
                                    key={specialty._id}
                                    _id={specialty._id}
                                    slug={specialty.slug}
                                    name={specialty.name}
                                    icon={specialty.icon}
                                    doctorCount={specialty.doctorCount}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <PaginationWrapper
                                currentPage={currentPage}
                                totalPages={totalPages}
                            />
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            لم يتم العثور على نتائج
                        </h3>
                        <p className="text-gray-500">
                            جرب تغيير معايير البحث
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
