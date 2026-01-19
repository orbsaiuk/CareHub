"use client";

import { ListingLayout } from "../../components/shared/ListingLayout";
import { SpecialtyCard } from "../../components/cards/SpecialtyCard";
import { FaTooth, FaEye, FaBaby, FaHeartbeat, FaBrain, FaStethoscope, FaBone, FaLungs } from "react-icons/fa";

const specialtiesData = [
  {
    id: 1,
    name: "طب الأسنان",
    icon: FaTooth,
    doctorCount: "120 طبيب",
  },
  {
    id: 2,
    name: "طب العيون",
    icon: FaEye,
    doctorCount: "85 طبيب",
  },
  {
    id: 3,
    name: "طب الأطفال",
    icon: FaBaby,
    doctorCount: "95 طبيب",
  },
  {
    id: 4,
    name: "طب القلب",
    icon: FaHeartbeat,
    doctorCount: "60 طبيب",
  },
  {
    id: 5,
    name: "المخ والأعصاب",
    icon: FaBrain,
    doctorCount: "45 طبيب",
  },
  {
    id: 6,
    name: "الطب العام",
    icon: FaStethoscope,
    doctorCount: "200 طبيب",
  },
  {
    id: 7,
    name: "العظام والمفاصل",
    icon: FaBone,
    doctorCount: "75 طبيب",
  },
  {
    id: 8,
    name: "الصدرية",
    icon: FaLungs,
    doctorCount: "55 طبيب",
  },
];

export default function SpecialtiesPage() {
  return (
    <ListingLayout
      title="تصفح جميع التخصصات"
      subtitle="اعثر على التخصص الطبي الذي تبحث عنه بسهولة من بين قائمة شاملة من التخصصات الدقيقة"
      searchPlaceholder="ابحث عن تخصص..."
      sectionTitle="جميع التخصصات الطبية"
      className="md:grid-cols-2 lg:grid-cols-4"
    >
      {specialtiesData.map((specialty) => (
        <SpecialtyCard key={specialty.id} {...specialty} />
      ))}
    </ListingLayout>
  );
}
