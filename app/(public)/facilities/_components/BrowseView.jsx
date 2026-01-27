import { FeatureSteps } from "@/components/shared/FeatureSteps";
import { FacilitiesSection } from "./FacilitiesSection";
import { PromotionalBanner } from "@/components/shared/PromotionalBanner";

export function BrowseView({ data, steps }) {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <FeatureSteps steps={steps} />

            {data.featuredFacilities.length > 0 && (
                <FacilitiesSection
                    title="المستشفيات "
                    facilities={data.featuredFacilities}
                    link="/facilities?type=مستشفى"
                />
            )}

            {data.banners?.[0] && (
                <PromotionalBanner
                    image={data.banners[0].image}
                    ctaLink={data.banners[0].ctaLink}
                    title={data.banners[0].title}
                />
            )}

            {data.clinics.length > 0 && (
                <FacilitiesSection
                    title="العيادات"
                    facilities={data.clinics}
                    link="/facilities?type=عيادة"
                />
            )}
        </div>
    );
}
