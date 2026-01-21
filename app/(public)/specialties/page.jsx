"use client";

import { useState } from "react";
import { SpecialtyCard } from "@/components/cards/SpecialtyCard";
import { ListingLayout } from "@/components/shared/ListingLayout";
import {
    Tooth,
    Eye,
    ChildCognition,
    HeartOrgan,
    ChildProgram,
    Stethoscope,
    Lungs,
    Kidneys,
    PharmacyAlt,
    GeneralSurgery,
    EarNoseThroat,
    Xray,
    Gynecology,
    SkinCancer,
} from "healthicons-react";
import { BoneIcon } from "lucide-react";
import { RiPsychotherapyFill } from "react-icons/ri";

const specialtiesData = [
    {
        _id: "1",
        slug: "dentistry",
        name: "طب الأسنان",
        icon: Tooth,
        doctorCount: 120,
    },
    {
        _id: "2",
        slug: "ophthalmology",
        name: "طب العيون",
        icon: Eye,
        doctorCount: 85,
    },
    {
        _id: "3",
        slug: "pediatrics",
        name: "طب الأطفال",
        icon: ChildProgram,
        doctorCount: 95,
    },
    {
        _id: "4",
        slug: "cardiology",
        name: "طب القلب",
        icon: HeartOrgan,
        doctorCount: 60,
    },
    {
        _id: "5",
        slug: "neurology",
        name: "المخ والأعصاب",
        icon: ChildCognition,
        doctorCount: 45,
    },
    {
        _id: "6",
        slug: "general",
        name: "الطب العام",
        icon: Stethoscope,
        doctorCount: 200,
    },
    {
        _id: "7",
        slug: "orthopedics",
        name: "العظام والمفاصل",
        icon: BoneIcon,
        doctorCount: 75,
    },
    {
        _id: "8",
        slug: "pulmonology",
        name: "الصدرية",
        icon: Lungs,
        doctorCount: 55,
    },
    {
        _id: "9",
        slug: "dermatology",
        name: "الجلدية",
        icon: SkinCancer,
        doctorCount: 90,
    },
    {
        _id: "10",
        slug: "radiology",
        name: "الأشعة",
        icon: Xray,
        doctorCount: 65,
    },
    {
        _id: "11",
        slug: "surgery",
        name: "الجراحة العامة",
        icon: GeneralSurgery,
        doctorCount: 80,
    },
    {
        _id: "12",
        slug: "pharmacy",
        name: "الصيدلة",
        icon: PharmacyAlt,
        doctorCount: 150,
    },
    {
        _id: "13",
        slug: "ent",
        name: "الأنف والأذن والحنجرة",
        icon: EarNoseThroat,
        doctorCount: 70,
    },
    {
        _id: "14",
        slug: "urology",
        name: "المسالك البولية",
        icon: Kidneys,
        doctorCount: 50,
    },
    {
        _id: "15",
        slug: "gynecology",
        name: "النساء والولادة",
        icon: Gynecology,
        doctorCount: 110,
    },
    {
        _id: "16",
        slug: "psychiatry",
        name: "الطب النفسي",
        icon: RiPsychotherapyFill,
        doctorCount: 40,
    },
];

const ITEMS_PER_PAGE = 8;

export default function SpecialtiesPage() {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination
    const totalPages = Math.ceil(specialtiesData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentSpecialties = specialtiesData.slice(startIndex, endIndex);

    return (
        <ListingLayout
            title="التخصصات الطبية"
            subtitle="اختر التخصص المناسب لحالتك الصحية"
            searchPlaceholder="ابحث عن تخصص طبي..."
            sectionTitle="جميع التخصصات"
            sectionSubtitle="استكشف التخصصات الطبية المتاحة"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
            {currentSpecialties.map((specialty) => (
                <SpecialtyCard
                    key={specialty._id}
                    {...specialty}
                />
            ))}
        </ListingLayout>
    );
}
