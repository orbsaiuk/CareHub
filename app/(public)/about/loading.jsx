import { Skeleton } from '@/components/ui/skeleton';

function ContactInfoCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-end gap-3 mb-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
            <div className="space-y-2 text-right">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 ml-auto" />
            </div>
        </div>
    );
}

function ContactFormSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="space-y-6">
                {/* Name Field */}
                <div className="text-right">
                    <Skeleton className="h-5 w-24 mb-2 ml-auto" />
                    <Skeleton className="h-12 w-full" />
                </div>

                {/* Email Field */}
                <div className="text-right">
                    <Skeleton className="h-5 w-32 mb-2 ml-auto" />
                    <Skeleton className="h-12 w-full" />
                </div>

                {/* Phone Field */}
                <div className="text-right">
                    <Skeleton className="h-5 w-24 mb-2 ml-auto" />
                    <Skeleton className="h-12 w-full" />
                </div>

                {/* Message Field */}
                <div className="text-right">
                    <Skeleton className="h-5 w-20 mb-2 ml-auto" />
                    <Skeleton className="h-32 w-full" />
                </div>

                {/* Submit Button */}
                <Skeleton className="h-14 w-full" />
            </div>
        </div>
    );
}

export default function AboutLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section Skeleton */}
            <section className="bg-gradient-to-b from-blue-50 to-gray-50 py-16">
                <div className="container mx-auto px-4 text-center">
                    <Skeleton className="h-12 w-64 mx-auto mb-4" />
                    <Skeleton className="h-6 w-96 mx-auto" />
                </div>
            </section>

            {/* Contact Section Skeleton */}
            <section className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info Cards Skeleton */}
                    <div className="space-y-6">
                        <ContactInfoCardSkeleton />
                        <ContactInfoCardSkeleton />
                        <ContactInfoCardSkeleton />
                        <ContactInfoCardSkeleton />
                    </div>

                    {/* Contact Form Skeleton */}
                    <ContactFormSkeleton />
                </div>
            </section>
        </div>
    );
}
