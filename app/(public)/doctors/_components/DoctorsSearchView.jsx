import { SearchFilters } from "@/components/shared/SearchFilters";
import { PaginationWrapper } from "@/components/shared/PaginationWrapper";
import { DoctorsGrid, DoctorNoResults } from ".";
import { DoctorsSearchHeader } from "./DoctorsSearchHeader";

export function DoctorsSearchView({
    searchResults,
    totalCount,
    totalPages,
    currentPage,
    allSpecialties,
    allCities,
    searchTerm,
    selectedSpecialtyName,
    selectedCity,
}) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Search Header */}
            <DoctorsSearchHeader
                searchTerm={searchTerm}
                selectedSpecialtyName={selectedSpecialtyName}
                selectedCity={selectedCity}
                totalCount={totalCount}
            />

            {/* Results Grid */}
            {searchResults.length > 0 ? (
                <>
                    <DoctorsGrid doctors={searchResults} />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <PaginationWrapper
                            totalPages={totalPages}
                            currentPage={currentPage}
                        />
                    )}
                </>
            ) : (
                <DoctorNoResults />
            )}
        </div>
    );
}
