"use client";

import { ListingLayout } from "../../components/shared/ListingLayout";
import { DoctorCard } from "../../components/cards/DoctorCard";

const doctorsData = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  name: i % 2 === 0 ? "د. أحمد محمود" : "د. سارة خالد",
  specialty: i % 2 === 0 ? "طب القلب" : "طب الأسنان",
  rating: 4.8,
  reviewsCount: 120 + i * 10,
  experienceYears: 10 + (i % 5),
  price: 200 + (i * 50),
  isAvailable: i % 3 !== 0,
}));

export default function DoctorsPage() {
  return (
    <ListingLayout
      title="ابحث عن طبيبك المناسب"
      subtitle="أكثر من 2,500 طبيب معتمد جاهزون لخدمتك في جميع التخصصات الطبية"
      searchPlaceholder="ابحث عن طبيبك..."
      sectionTitle="تواصل مع أفضل الأطباء"
    >
      {doctorsData.map((doctor) => (
        <DoctorCard key={doctor.id} {...doctor} />
      ))}
    </ListingLayout>
  );
}
