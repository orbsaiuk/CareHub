
import Link from "next/link";

export function DoctorNoResults() {
    return (
        <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
                لم يتم العثور على نتائج
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
                عذراً، لم نتمكن من العثور على أطباء مطابقين لبحثك. جرب تعديل
                معايير البحث أو إزالة بعض الفلاتر.
            </p>
            <Link
                href="/doctors"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
                العودة لصفحة الأطباء
            </Link>
        </div>
    );
}
