import { Skeleton } from "@/components/ui/skeleton";

export default function PublicLoading() {
    return (
        <div className="min-h-screen">
            {/* Hero Section Skeleton - matches primary/10 background */}
            <section className="relative w-full bg-primary/10 min-h-screen flex flex-col py-10">
                <main className="flex-1 flex flex-col items-center justify-center px-4 container mx-auto">
                    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto">
                        <div className="flex flex-col items-center gap-2 w-full text-center space-y-4">
                            <Skeleton className="h-16 w-3/4 mx-auto" />
                            <Skeleton className="h-16 w-2/3 mx-auto" />
                            <Skeleton className="h-6 w-full max-w-2xl mx-auto mt-4" />
                        </div>
                    </div>

                    {/* Search Card Skeleton */}
                    <div className="w-full max-w-5xl mt-12 mb-20">
                        <div className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-xl p-6 sm:p-8">
                            <div className="flex flex-col lg:flex-row items-stretch gap-4 mb-8">
                                <Skeleton className="flex-1 h-14 rounded-2xl" />
                                <Skeleton className="h-14 w-full lg:w-32 rounded-2xl" />
                            </div>
                            <div className="flex flex-wrap justify-center gap-3">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} className="h-9 w-24 rounded-full" />
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </section>

            {/* Specialties Section - white background */}
            <section className="w-full py-20 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex flex-col items-center gap-4 mb-16">
                        <Skeleton className="h-12 w-64 mx-auto" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-md p-8">
                                <div className="flex flex-col items-center space-y-4">
                                    <Skeleton className="h-20 w-20 rounded-2xl" />
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-12">
                        <Skeleton className="h-14 w-48 rounded-xl" />
                    </div>
                </div>
            </section>

            {/* Featured Doctors Section - gray-50/30 background */}
            <section className="w-full py-20 bg-gray-50/30">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col items-center gap-4 mb-16">
                        <Skeleton className="h-12 w-64 mx-auto" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg shadow-md p-5">
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
                                <Skeleton className="h-px w-full mb-3" />
                                <Skeleton className="h-5 w-32 mx-auto" />
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Hospitals Section - white background */}
            <section className="w-full py-20 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col items-center gap-4 mb-16">
                        <Skeleton className="h-12 w-64 mx-auto" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <Skeleton className="h-48 w-full" />
                                <div className="p-5 space-y-3">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-6 w-24 rounded-md" />
                                    <Skeleton className="h-12 w-full rounded-lg" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
