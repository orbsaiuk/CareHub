import { FeatureBadges, PromotionalBanner } from ".";
import { SpecialtySection } from "./SpecialtySection";

export function DoctorsBrowseView({ specialtiesData, promotionalBanners }) {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Feature Badges */}
            <FeatureBadges />

            {/* Specialties Sections */}
            <div className="space-y-12">
                {specialtiesData.map((specialty, specialtyIndex) => (
                    <div key={specialty.id}>
                        <SpecialtySection specialty={specialty} />

                        {/* Banner between specialties */}
                        {specialtyIndex < specialtiesData.length - 1 && promotionalBanners.length > 0 && (
                            <PromotionalBanner
                                image={promotionalBanners[specialtyIndex % promotionalBanners.length].image}
                                ctaLink={promotionalBanners[specialtyIndex % promotionalBanners.length].ctaLink}
                                title={promotionalBanners[specialtyIndex % promotionalBanners.length].title}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
