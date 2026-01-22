"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DoctorCard } from "@/components/cards/DoctorCard";

export function SpecialtySection({ specialty }) {
    return (
        <div>
            {/* Specialty Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-linear-bg flex items-center justify-center">
                        {specialty.icon && (
                            <div className="relative w-8 h-8">
                                <Image
                                    src={specialty.icon}
                                    alt={specialty.name}
                                    fill
                                    className="object-contain brightness-0 invert"
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{specialty.name}</h2>
                        <p className="text-sm text-gray-500">الأطباء المتاحون ({specialty.count})</p>
                    </div>
                </div>
                <Button variant="link" className="text-primary hover:text-primary/80 font-bold">
                    عرض الكل
                </Button>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {specialty.doctors.map((doctor) => (
                    <DoctorCard
                        key={doctor._id}
                        slug={doctor.slug}
                        name={doctor.name}
                        specialty={doctor.specialty}
                        rating={doctor.rating}
                        reviewsCount={doctor.reviewsCount}
                        consultationFee={doctor.consultationFee}
                        experienceYears={doctor.experienceYears}
                        hospitals={doctor.hospitals}
                        image={doctor.image}
                        isAvailable={doctor.isAvailable}
                    />
                ))}
            </div>
        </div>
    );
}
