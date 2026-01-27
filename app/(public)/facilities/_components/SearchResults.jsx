import { SearchHeader } from "./SearchHeader";
import { FacilitiesGrid } from "./FacilitiesGrid";
import { FacilitiesNoResults } from "./FacilitiesNoResults";
import { PaginationWrapper } from "@/components/shared/PaginationWrapper";

export function SearchResults({ data, params, sortOptions }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SearchHeader 
                params={params} 
                totalCount={data.totalCount} 
                sortOptions={sortOptions} 
            />

            {data.facilities.length > 0 ? (
                <>
                    <FacilitiesGrid facilities={data.facilities} />
                    {data.totalPages > 1 && (
                        <PaginationWrapper
                            currentPage={data.currentPage}
                            totalPages={data.totalPages}
                        />
                    )}
                </>
            ) : (
                <FacilitiesNoResults />
            )}
        </div>
    );
}
