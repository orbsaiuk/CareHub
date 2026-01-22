import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorsLoading() {
    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 font-sans" dir="rtl">
            {/* Hero & Search Section Skeleton - matches primary/10 background */}
            <div className="relative bg-primary/10 pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-4 mb-10">
                    <Skeleton className="h-12 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-2/3 mx-auto" />
                </div>

                {/* Floating Search Bar Skeleton */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-2 border border-blue-50">
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
                            <Skeleton className="flex-1 h-12 rounded-xl" />
                            <Skeleton className="h-12 w-full md:w-48 rounded-xl" />
                            <Skeleton className="h-12 w-full md:w-48 rounded-xl" />
                            <Skeleton className="h-12 w-full md:w-32 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {/* Feature Badges Skeleton */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-40 rounded-full" />
                    ))}
                </div>

                {/* Specialty Sections Skeleton */}
                {[...Array(3)].map((_, sectionIndex) => (
                    <div key={sectionIndex} className="mb-16">
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                            <Skeleton className="h-10 w-24 rounded-xl" />
                        </div>

                        {/* Doctor Cards Grid - matches white bg with shadow-md */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, cardIndex) => (
                                <div key={cardIndex} className="bg-white rounded-lg shadow-md p-5">
                                    <div className="flex gap-4 mb-4">
                                        <Skeleton className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl flex-shrink-0" />
                                        <div className="flex-1 space-y-3">
                                            <Skeleton className="h-5 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                            <div className="flex gap-2">
                                                <Skeleton className="h-6 w-20 rounded-sm" />
                                                <Skeleton className="h-6 w-24 rounded-sm" />
                                            </div>
                                            <Skeleton className="h-10 w-full rounded-md" />
                                        </div>
                                    </div>
                                    <div className="border-t border-dashed pt-3">
                                        <Skeleton className="h-5 w-32 mx-auto" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <Skeleton className="h-10 w-full rounded-md" />
                                        <Skeleton className="h-10 w-full rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Promotional Banner (except last section) */}
                        {sectionIndex < 2 && (
                            <div className="mt-12">
                                <Skeleton className="h-32 w-full rounded-xl" />
                            </div>
                        )}
                    </div>
                ))}
            </main>
        </div>
    );
}
