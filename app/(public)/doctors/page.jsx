"use client";

import {
    HeroSearchSection,
    FeatureBadges,
    PromotionalBanner,
    SpecialtySection,
    specialtiesData
} from "./_components";

export default function DoctorsPage() {
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
                        {specialtyIndex < specialtiesData.length - 1 && (
                            <PromotionalBanner
                                title="صيدلية"
                                subtitle="اطلب الأدوية الآن"
                                link="عرض الكل"
                            />
                        )}
                    </div>
                ))}
            </main>
        </div>
    );
}
