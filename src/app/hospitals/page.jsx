"use client";

import { ListingLayout } from "../../components/shared/ListingLayout";
import { HospitalCard } from "../../components/cards/HospitalCard";

const hospitalsData = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  name: i % 2 === 0 ? "مستشفى الملك فيصل التخصصي" : "مستشفى دله",
  type: i % 2 === 0 ? "مستشفى حكومي" : "مستشفى خاص",
  rating: 4.5 + (i * 0.1),
  reviewsCount: 500 + i * 100,
  location: "الرياض - طريق الملك فهد",
  isOpen: i % 3 !== 0,
}));

export default function HospitalsPage() {
  return (
    <ListingLayout
      title="اعثر على أقرب مستشفى"
      subtitle="شبكة واسعة من المستشفيات والمراكز الطبية المعتمدة لتقديم أفضل رعاية لك ولعائلتك"
      searchPlaceholder="ابحث عن اسم المستشفى..."
      sectionTitle="أفضل المستشفيات الموصى بها"
      className="md:grid-cols-3"
    >
      {hospitalsData.map((hospital) => (
        <HospitalCard key={hospital.id} {...hospital} />
      ))}
    </ListingLayout>
  );
}
