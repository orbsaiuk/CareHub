"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

export function DoctorsSection({ doctors = [] }) {
    const defaultDoctors = [
        {
            id: 1,
            name: "د. أحمد محمود",
            specialty: "طب القلب",
            rating: 4.8,
            experience: "15 سنة خبرة",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=60",
            available: true
        },
        {
            id: 2,
            name: "د. أحمد محمود",
            specialty: "طب القلب",
            rating: 4.8,
            experience: "15 سنة خبرة",
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=60",
            available: true
        }
    ];

    const displayDoctors = doctors.length > 0 ? doctors : defaultDoctors;

    return (
        <Card className="border-1 shadow-md border-r-4 border-r-primary">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">الأطباء</h2>
                    <Button variant="link" className="text-primary hover:text-primary/80 p-0">
                        عرض الكل
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayDoctors.map((doctor) => (
                        <div
                            key={doctor.id}
                            className="flex gap-4 p-4 bg-white border-2 border-gray-100 rounded-lg"
                        >
                            {/* Doctor Image */}
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src={doctor.image}
                                    alt={doctor.name}
                                    fill
                                    className="object-cover"
                                />
                                {doctor.available && (
                                    <div className="absolute top-1 right-1">
                                        <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                    </div>
                                )}
                            </div>

                            {/* Doctor Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 mb-1">{doctor.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>

                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center gap-1">
                                        <FaStar className="w-3 h-3 text-yellow-400" />
                                        <span className="text-sm font-medium text-gray-900">{doctor.rating}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{doctor.experience}</span>
                                </div>

                                <Button size="sm" className="w-full bg-primary hover:bg-primary/80 text-sm">
                                    احجز موعد
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
