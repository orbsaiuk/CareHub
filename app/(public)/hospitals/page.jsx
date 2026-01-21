"use client";

import { useState } from "react";
import { HospitalCard } from "@/components/cards/HospitalCard";
import { ListingLayout } from "@/components/shared/ListingLayout";

// Mock data - expanded to 18 hospitals for pagination
const hospitalsData = Array.from({ length: 18 }).map((_, i) => ({
    _id: `hospital-${i}`,
    slug: `hospital-${i}`,
    name: i % 2 === 0 ? "مستشفى الملك فيصل التخصصي" : "مستشفى دله",
    type: i % 2 === 0 ? "مستشفى حكومي" : "مستشفى خاص",
    rating: 4.5 + (i * 0.1),
    reviewsCount: 500 + i * 100,
    address: {
        city: "الرياض",
        street: "طريق الملك فهد"
    },
    isOpen: i % 3 !== 0,
    logo: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&auto=format&fit=crop&q=60"
}));

const ITEMS_PER_PAGE = 9;

export default function HospitalsPage() {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination
    const totalPages = Math.ceil(hospitalsData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentHospitals = hospitalsData.slice(startIndex, endIndex);

    return (
        <ListingLayout
            title="المستشفيات والعيادات"
            subtitle="منشآت طبية معتمدة بأحدث التجهيزات والكوادر الطبية المتميزة"
            searchPlaceholder="ابحث عن مستشفى أو عيادة..."
            sectionTitle="المستشفيات المتاحة"
            sectionSubtitle="اختر من بين أفضل المنشآت الطبية"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
            {currentHospitals.map((hospital) => (
                <HospitalCard
                    key={hospital._id}
                    slug={hospital.slug}
                    name={hospital.name}
                    rating={hospital.rating}
                    reviewsCount={hospital.reviewsCount}
                    location={`${hospital.address.city} - ${hospital.address.street}`}
                    imageUrl={hospital.logo}
                />
            ))}
        </ListingLayout>
    );
}
