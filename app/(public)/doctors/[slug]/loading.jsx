import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorDetailLoading() {
    return (
        <div className="bg-gray-50/30 min-h-screen">
            <div className="container mx-auto py-8">
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Hero Section Skeleton - white card with shadow-md and border-r-4 border-r-primary */}
                        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border-r-4 border-r-primary">
                            <div className="flex flex-col md:flex-row gap-6">
                                <Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-2xl flex-shrink-0" />
                                <div className="flex-1 space-y-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-8 w-3/4" />
                                        <Skeleton className="h-6 w-1/2" />
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <Skeleton className="h-7 w-24 rounded-sm" />
                                        <Skeleton className="h-7 w-28 rounded-sm" />
                                    </div>
                                    <Skeleton className="h-10 w-48 rounded-md" />
                                    <div className="flex gap-5">
                                        {[...Array(4)].map((_, i) => (
                                            <Skeleton key={i} className="h-5 w-5 rounded-full" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Section Skeleton - white card with shadow-md */}
                        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                            <Skeleton className="h-6 w-32" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                            <div className="pt-4">
                                <Skeleton className="h-5 w-40 mb-3" />
                                <div className="flex flex-wrap gap-2">
                                    {[...Array(4)].map((_, i) => (
                                        <Skeleton key={i} className="h-8 w-24 rounded-md" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Qualifications Section Skeleton */}
                        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                            <Skeleton className="h-6 w-40" />
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border">
                                        <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-5 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Working Hours Section Skeleton */}
                        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                            <Skeleton className="h-6 w-32" />
                            <div className="space-y-2">
                                {[...Array(7)].map((_, i) => (
                                    <div key={i} className="flex justify-between items-center py-3 border-b last:border-0">
                                        <Skeleton className="h-5 w-24" />
                                        <Skeleton className="h-5 w-32" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews Section Skeleton */}
                        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-10 w-32 rounded-md" />
                            </div>
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="border-b pb-4 last:border-0">
                                        <div className="flex items-start gap-3 mb-3">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-5 w-32" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-4 w-full mb-2" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sticky Booking Card with border-r-4 border-r-primary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20">
                            <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border-r-4 border-r-primary">
                                <div className="space-y-2">
                                    <Skeleton className="h-7 w-3/4" />
                                    <Skeleton className="h-5 w-full" />
                                </div>
                                <Skeleton className="h-12 w-full rounded-md" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
