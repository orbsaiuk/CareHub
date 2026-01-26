import { FacilityCard } from "@/components/cards/FacilityCard";

export function FacilitiesGrid({ facilities }) {
    if (!facilities || facilities.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {facilities.map((facility) => (
                <FacilityCard
                    key={facility._id}
                    slug={facility.slug}
                    name={facility.name}
                    rating={facility.rating}
                    reviewsCount={facility.reviewsCount}
                    location={`${facility.address?.city || ""} - ${facility.address?.street || ""}`}
                    logo={facility.logo}
                />
            ))}
        </div>
    );
}
