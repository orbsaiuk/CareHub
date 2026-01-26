"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { FaMapMarkerAlt } from "react-icons/fa";

// Facility type translations
const facilityTypeLabels = {
    hospital: 'مستشفى',
    clinic: 'عيادة',
};

export function FacilityHero({ facility }) {
    return (
        <div className="relative w-full h-[280px] md:h-[420px]">
            {/* Background Image */}
            <Image
                src={facility.images?.[0] || facility.logo}
                alt={facility.name}
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
                    {facility.type && (
                        <Badge className="mb-3 bg-red-500 hover:bg-red-600 text-white border-none">
                            {facilityTypeLabels[facility.type] || facility.type}
                        </Badge>
                    )}

                    {/* Facility Name */}
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        {facility.name}
                    </h1>

                    {/* Location */}
                    {facility.address && (
                        <div className="flex items-center gap-2 text-white/90">
                            <FaMapMarkerAlt className="w-4 h-4" />
                            <span className="text-sm md:text-base">
                                {facility.address.city && facility.address.district
                                    ? `${facility.address.city}, ${facility.address.district}`
                                    : facility.address.city || facility.address.district || "الرياض"}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
