"use client";

import { Card, CardContent } from "@/components/ui/card";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";


export function FacilitiesSection({ facilities = [] }) {
    const defaultFacilities = [
        "عيادات خارجية متخصصة",
        "وحدة أشعة رقمية",
        "معمل تحاليل متقدم",
        "استقبال 24 ساعة",
    ];

    const displayFacilities = facilities.length > 0 ? facilities : defaultFacilities;

    return (
        <Card className="border-1 border-r-4 border-r-primary">
            <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">المرافق والخدمات</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {displayFacilities.map((facility, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-lg"
                        >
                            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                                <IoMdCheckmarkCircleOutline className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-gray-900 text-lg font-medium">{facility.name || facility}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
