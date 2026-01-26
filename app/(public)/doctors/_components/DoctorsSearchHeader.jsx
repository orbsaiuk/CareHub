import Link from "next/link";
import { X } from "lucide-react";

export function DoctorsSearchHeader({ searchTerm, selectedSpecialtyName, selectedCity, totalCount }) {
    const pageTitle = searchTerm
        ? `نتائج البحث عن "${searchTerm}"`
        : selectedSpecialtyName
            ? `أطباء ${selectedSpecialtyName.replace(/^طب\s+/, '')}`
            : selectedCity
                ? `أطباء في ${selectedCity}`
                : "جميع الأطباء";

    const resultMessage = totalCount > 0
        ? (() => {
            const count = totalCount;
            if (count === 1) return `تم العثور على طبيب واحد مطابق لبحثك`;
            if (count === 2) return `تم العثور على طبيبين مطابقين لبحثك`;
            if (count >= 3 && count <= 10) return `تم العثور على ${count} أطباء مطابقين لبحثك`;
            return `تم العثور على ${count} طبيبًا مطابقًا لبحثك`;
        })()
        : "لم يتم العثور على أطباء";

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 pb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">{pageTitle}</h2>
                <p className="text-gray-500 mt-1">{resultMessage}</p>
            </div>

            {/* Clear Filters Button */}
            <Link
                href="/doctors"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
                <X className="w-4 h-4" />
                مسح الفلاتر
            </Link>
        </div>
    );
}
