import { HeroSection } from "@/components/sections/HeroSection";
import { SpecialtiesSection } from "@/components/sections/SpecialtiesSection";
import { FeaturedDoctorsSection } from "@/components/sections/FeaturedDoctorsSection";
import { FeaturedFacilitiesSection } from "@/components/sections/FeaturedFacilitiesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { CallToActionSection } from "@/components/sections/CallToActionSection";
import { FeaturesOverviewSection } from "@/components/sections/FeaturesOverviewSection";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
    return (
        <>
            <HeroSection />
            <SpecialtiesSection />
            <FeaturesOverviewSection />
            <FeaturedDoctorsSection />
            <FeaturedFacilitiesSection />
            <TestimonialsSection />
            <NewsletterSection />
            <CallToActionSection />
        </>
    );
}
