import {
    HeroSearchSection,
    FeatureBadges,
    PromotionalBanner,
} from "./_components";
import { SpecialtySection } from "./_components/SpecialtySection";
import { client } from "@/sanity/lib/client";
import { getFeaturedSpecialtiesQuery } from "@/sanity/queries/specialties";
import { getDoctorsBySpecialtyQuery } from "@/sanity/queries/doctors";
import { getActivePromotionalBanners } from "@/services/sanity/promotionalBanners";

async function getSpecialtiesWithDoctors() {
    try {
        // Get featured specialties
        const specialties = await client.fetch(getFeaturedSpecialtiesQuery, { limit: 8 });

        // For each specialty, fetch its doctors
        const specialtiesWithDoctors = await Promise.all(
            specialties.map(async (specialty) => {
                const doctors = await client.fetch(getDoctorsBySpecialtyQuery, {
                    specialtyId: specialty._id,
                    start: 0,
                    end: 3 // Get 3 doctors per specialty
                });

                return {
                    id: specialty._id,
                    _id: specialty._id,
                    name: specialty.name,
                    icon: specialty.icon,
                    count: specialty.doctorCount,
                    doctors: doctors.map(doctor => ({
                        _id: doctor._id,
                        slug: doctor.slug,
                        name: doctor.name,
                        specialty: doctor.specialty?.name || specialty.name,
                        rating: doctor.rating || 0,
                        reviewsCount: doctor.reviewsCount || 0,
                        consultationFee: doctor.consultationFee,
                        experienceYears: doctor.experienceYears,
                        isAvailable: doctor.isActive,
                        hospitals: doctor.hospitals || [],
                        image: doctor.image,
                    }))
                };
            })
        );

        return specialtiesWithDoctors.filter(s => s.doctors.length > 0);
    } catch (error) {
        console.error('Error fetching specialties with doctors:', error);
        return [];
    }
}

export default async function DoctorsPage() {
    const [specialtiesData, promotionalBanners] = await Promise.all([
        getSpecialtiesWithDoctors(),
        getActivePromotionalBanners("all")
    ]);

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 font-sans" dir="rtl">
            {/* Hero & Search Section */}
            <HeroSearchSection />

            {/* Content Section */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {/* Feature Badges */}
                <FeatureBadges />

                {/* Specialties Sections */}
                {specialtiesData.map((specialty, specialtyIndex) => (
                    <div key={specialty.id}>
                        <SpecialtySection specialty={specialty} />

                        {/* Banner between specialties (except after last one) */}
                        {specialtyIndex < specialtiesData.length - 1 && promotionalBanners.length > 0 && (
                            <PromotionalBanner
                                image={promotionalBanners[specialtyIndex % promotionalBanners.length].image}
                                ctaLink={promotionalBanners[specialtyIndex % promotionalBanners.length].ctaLink}
                                title={promotionalBanners[specialtyIndex % promotionalBanners.length].title}
                            />
                        )}
                    </div>
                ))}
            </main>
        </div>
    );
}
