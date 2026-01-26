"use client";

import { HeroSection } from "@/components/shared/HeroSection";

export function HeroSearchSection({ specialties = [], cities = [] }) {
    return (
        <HeroSection
            title="ابحث عن طبيبك المناسب"
            subtitle="أكثر من 2,500 طبيب معتمد جاهزون لخدمتك في جميع التخصصات الطبية"
            categories={specialties}
            cities={cities}
            searchPlaceholder=" اكتب اسم الطبيب"
            baseSearchUrl="/doctors"
        />
    );
}

