import { Card, CardContent } from "@/components/ui/card";

export default function WorkingHoursSection({ availability }) {
    const daysOfWeek = [
        { ar: "السبت", en: "saturday" },
        { ar: "الأحد", en: "sunday" },
        { ar: "الإثنين", en: "monday" },
        { ar: "الثلاثاء", en: "tuesday" },
        { ar: "الأربعاء", en: "wednesday" },
        { ar: "الخميس", en: "thursday" },
        { ar: "الجمعة", en: "friday" }
    ];

    const getScheduleForDay = (dayEn) => {
        return availability?.find(slot => slot.day === dayEn);
    };

    return (
        <Card className="border-1 shadow-md border-blue-100 border-r-4 border-r-primary">
            <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-900 text-right">مواعيد العمل</h2>

                <div className="grid grid-cols-2 gap-3">
                    {daysOfWeek.map((day, index) => {
                        const schedule = getScheduleForDay(day.en);
                        const isOff = !schedule;

                        return (
                            <div
                                key={index}
                                className={`p-3 rounded-lg flex items-center justify-between ${isOff ? 'bg-red-50' : 'bg-blue-50'
                                    }`}
                            >
                                <div className="font-bold text-gray-900">{day.ar}</div>
                                {isOff ? (
                                    <div className="text-red-600 font-medium">عطلة</div>
                                ) : (
                                    <div className="text-gray-600">
                                        {schedule.startTime} - {schedule.endTime}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
