import { Skeleton } from "@/components/ui/skeleton";

export default function SpecialtiesLoading() {
    return (
        <div className="min-h-screen bg-gray-50/50" dir="rtl">
            {/* Hero Section Skeleton - matches primary/10 background */}
            <div className="relative bg-primary/10 pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-4 mb-10">
                    <Skeleton className="h-12 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-2/3 mx-auto" />
                </div>

                {/* Search Bar Skeleton */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-2 border border-blue-50">
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Section Header */}
                <div className="mb-8 space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-64" />
                </div>

                {/* Specialty Cards Grid - white bg with shadow-md and rounded-2xl */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-shadow">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <Skeleton className="h-20 w-20 rounded-2xl" />
                                <div className="space-y-2 w-full">
                                    <Skeleton className="h-6 w-3/4 mx-auto" />
                                    <Skeleton className="h-5 w-20 mx-auto rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="flex justify-center gap-2">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-10 rounded-md" />
                    ))}
                </div>
            </div>
        </div>
    );
}
