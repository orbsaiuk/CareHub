
import Link from "next/link";

export function FacilitiesNoResults() {
    return (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">لم يتم العثور على منشآت طبية</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
                لم نتمكن من العثور على نتائج مطابقة لبحثك. جرب تغيير كلمات البحث أو إزالة بعض الفلاتر.
            </p>
            <Link
                href="/facilities"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
                عرض جميع المنشآت
            </Link>
        </div>
    );
}
