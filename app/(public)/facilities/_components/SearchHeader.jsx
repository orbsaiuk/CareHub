import { SortDropdown } from "@/components/shared/SortDropdown";
import { X } from "lucide-react";
import Link from "next/link";

export function SearchHeader({ params, totalCount, sortOptions }) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 pb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    {params.search
                        ? `نتائج البحث عن "${params.search}"`
                        : params.type === "مستشفى"
                            ? "المستشفيات"
                            : params.type === "عيادة"
                                ? "العيادات"
                                : "نتائج البحث"}
                </h2>
                <p className="text-gray-500 mt-1">
                    {totalCount > 0
                        ? (() => {
                            const count = totalCount;
                            let word;

                            if (params.type === "مستشفى") {
                                word = count === 1 ? "مستشفى واحد" : count === 2 ? "مستشفيان" : `${count} مستشفيات`;
                            } else if (params.type === "عيادة") {
                                word = count === 1 ? "عيادة واحدة" : count === 2 ? "عيادتان" : `${count} عيادات`;
                            } else {
                                word = count === 1 ? "منشأة طبية واحدة" : count === 2 ? "منشأتان طبيتان" : `${count} منشأة طبية`;
                            }

                            return `تم العثور على ${word}`;
                        })()
                        : "لم يتم العثور على نتائج"
                    }
                </p>
            </div>

            <div className="flex items-center gap-4">
                <SortDropdown sortOptions={sortOptions} />
                <Link
                    href="/facilities"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                    <X className="w-4 h-4" />
                    مسح الفلاتر
                </Link>
            </div>
        </div>
    );
}
