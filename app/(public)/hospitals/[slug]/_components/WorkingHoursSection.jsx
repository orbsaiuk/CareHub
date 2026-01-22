"use client";

import { Card, CardContent } from "@/components/ui/card";

export function WorkingHoursSection({ workingHours = [] }) {
    const dayLabels = {
        sunday: "الأحد",
        monday: "الإثنين",
        tuesday: "الثلاثاء",
        wednesday: "الأربعاء",
        thursday: "الخميس",
        friday: "الجمعة",
        saturday: "السبت",
    };

    if (!workingHours || workingHours.length === 0) return null;

    // Transform Sanity working hours to component format
    const schedule = workingHours.map(wh => ({
        day: dayLabels[wh.day] || wh.day,
        from: wh.is24Hours ? "24 ساعة" : wh.openTime || "",
        to: wh.is24Hours ? "" : wh.closeTime || "",
        status: wh.isOpen ? "open" : "closed",
        is24Hours: wh.is24Hours
    }));

    return (
        <Card className="border-1 border-r-4 border-r-primary">
            <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-900 text-right">مواعيد العمل</h2>

                <div className="grid grid-cols-2 gap-3">
                    {schedule.map((item, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-lg text-center flex items-center justify-between ${item.status === "closed"
                                ? "bg-red-50"
                                : "bg-blue-50"
                                }`}
                        >
                            <div className="font-bold text-gray-900 mb-1">{item.day}</div>
                            {item.status === "open" ? (
                                <div className="text-gray-600">
                                    {item.is24Hours ? "24 ساعة" : `${item.from} - ${item.to}`}
                                </div>
                            ) : (
                                <div className="text-red-600 font-medium">مغلق</div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
