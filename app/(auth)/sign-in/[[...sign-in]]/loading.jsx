import { Skeleton } from "@/components/ui/skeleton";

export default function SignInLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <Skeleton className="h-8 w-48 mx-auto" />
                        <Skeleton className="h-4 w-64 mx-auto" />
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Skeleton className="h-12 w-full" />

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-px flex-1" />
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-px flex-1" />
                    </div>

                    {/* Social Buttons */}
                    <div className="space-y-3">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Footer */}
                    <div className="text-center">
                        <Skeleton className="h-4 w-48 mx-auto" />
                    </div>
                </div>
            </div>
        </div>
    );
}
