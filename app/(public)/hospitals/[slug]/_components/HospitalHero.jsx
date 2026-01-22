"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { FaMapMarkerAlt } from "react-icons/fa";

// Hospital type translations
const hospitalTypeLabels = {
    general_hospital: 'مستشفى عام',
    specialized_hospital: 'مستشفى تخصصي',
    clinic: 'عيادة',
    medical_center: 'مركز طبي',
    diagnostic_center: 'مركز تشخيصي',
};

export function HospitalHero({ hospital }) {
    return (
        <div className="relative w-full h-[280px] md:h-[420px]">
            {/* Background Image */}
            <Image
                src={hospital.images?.[0] || hospital.logo}
                alt={hospital.name}
                fill
                className="object-cover"
                priority
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <div className="container mx-auto">
                    {/* Badge */}
                    {hospital.type && (
                        <Badge className="mb-3 bg-red-500 hover:bg-red-600 text-white border-none">
                            {hospitalTypeLabels[hospital.type] || hospital.type}
                        </Badge>
                    )}

                    {/* Hospital Name */}
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        {hospital.name}
                    </h1>

                    {/* Location */}
                    {hospital.address && (
                        <div className="flex items-center gap-2 text-white/90">
                            <FaMapMarkerAlt className="w-4 h-4" />
                            <span className="text-sm md:text-base">
                                {hospital.address.city && hospital.address.district
                                    ? `${hospital.address.city}, ${hospital.address.district}`
                                    : hospital.address.city || hospital.address.district || "الرياض"}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
