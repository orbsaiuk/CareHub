import { Skeleton } from "@/components/ui/skeleton";

export default function HospitalDetailLoading() {
    return (
        <div className="bg-gray-50/50 min-h-screen" dir="rtl">
            {/* Hero Section Skeleton - gradient overlay on image */}
            <div className="relative w-full h-[280px] md:h-[420px]">
                <Skeleton className="absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    <div className="container mx-auto">
                        <Skeleton className="h-7 w-32 mb-3 rounded-md bg-white/20" />
                        <Skeleton className="h-10 w-3/4 mb-3 bg-white/20" />
                        <Skeleton className="h-5 w-1/2 bg-white/20" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto py-8">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About Section Skeleton - white bg with shadow-sm */}
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                            <Skeleton className="h-6 w-32" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>

                        {/* Departments Section Skeleton */}
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                            <Skeleton className="h-6 w-40" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <Skeleton className="h-6 w-6 rounded-full" />
                                        <Skeleton className="h-5 w-3/4" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Facilities Section Skeleton */}
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                            <Skeleton className="h-6 w-32" />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Working Hours Section Skeleton */}
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                            <Skeleton className="h-6 w-32" />
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex justify-between items-center py-3 border-b last:border-0">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-5 w-40" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Doctors Section Skeleton */}
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-10 w-24 rounded-md" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <Skeleton className="h-16 w-16 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-5 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Gallery Section Skeleton */}
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                            <Skeleton className="h-6 w-32" />
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <Skeleton key={i} className="h-40 w-full rounded-lg" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Contact Card Skeleton - white bg with shadow-sm */}
                            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                                <Skeleton className="h-6 w-32" />
                                <div className="space-y-3">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
                                            <div className="flex-1 space-y-1">
                                                <Skeleton className="h-4 w-20" />
                                                <Skeleton className="h-5 w-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Skeleton className="h-12 w-full rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
