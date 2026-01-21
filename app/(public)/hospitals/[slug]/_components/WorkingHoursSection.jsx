"use client";

import { Card, CardContent } from "@/components/ui/card";

export function WorkingHoursSection({ workingHours = {} }) {
    const schedule = [
        { day: "السبت", from: "10:00 ص", to: "6:00 م", status: "open" },
        { day: "الأحد", from: "10:00 ص", to: "6:00 م", status: "open" },
        { day: "الاثنين", from: "10:00 ص", to: "6:00 م", status: "open" },
        { day: "الثلاثاء", from: "10:00 ص", to: "6:00 م", status: "open" },
        { day: "الأربعاء", from: "10:00 ص", to: "6:00 م", status: "open" },
        { day: "الخميس", from: "", to: "", status: "closed" },
        { day: "الجمعة", from: "", to: "", status: "closed" },
    ];

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
                                    {item.from} - {item.to}
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
