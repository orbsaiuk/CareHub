"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Pagination } from "./Pagination";

export function PaginationWrapper({ currentPage, totalPages }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());

        // Navigate to the new page
        router.push(`${pathname}?${params.toString()}`, { scroll: true });
    };

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
    );
}
