"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export function ContactCard({ hospital }) {
    return (
        <Card className="border-1 shadow-md border-r-4 border-r-primary">
            <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900">معلومات التواصل</h3>

                <div className="space-y-4 mb-6">
                    {/* Phone */}
                    <div className="flex items-start gap-3">
                        <FaPhone className="w-4 h-4 text-primary mt-1" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">رقم الهاتف</p>
                            <a
                                href={`tel:${hospital.phone}`}
                                className="text-gray-900 font-medium hover:text-primary transition-colors"
                            >
                                {hospital.phone || "+966 50 234 5678"}
                            </a>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-3">
                        <FaMapMarkerAlt className="w-4 h-4 text-primary mt-1" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">عنوان 102</p>
                            <p className="text-gray-900 font-medium">
                                شارع الملك فهد، الرياض، عنوان 102
                            </p>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                    <Button className="w-full bg-primary hover:bg-blue-600">
                        احجز الآن
                    </Button>
                    <Button variant="outline" className="w-full border-gray-300">
                        الموقع
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
