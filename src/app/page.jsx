import { CallToActionSection } from "../components/sections/CallToActionSection";
import { FeaturesOverviewSection } from "../components/sections/FeaturesOverviewSection";
import { FeaturedSection } from "../components/sections/FeaturedSection";
import { NewsletterSection } from "../components/sections/NewsletterSection";
import { SpecialtiesSection } from "../components/sections/SpecialtiesSection";
import { ServicesSection } from "../components/sections/ServicesSection";
import { TestimonialsSection } from "../components/sections/TestimonialsSection";
import { HeroSection } from "../components/sections/HeroSection";

export default function Page() {
  return (
    <div className="bg-white w-full flex flex-col">
      <HeroSection />
      <SpecialtiesSection />
      <FeaturesOverviewSection />
      <FeaturedSection />
      <ServicesSection />
      <TestimonialsSection />
      <NewsletterSection />
      <CallToActionSection />
    </div>
  );
}
