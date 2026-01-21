import { Card, CardContent } from "@/components/ui/card";

export default function WorkingHoursSection({ workingHours }) {
    const daysOfWeek = [
        { ar: "السبت", en: "Saturday" },
        { ar: "الأحد", en: "Sunday" },
        { ar: "الإثنين", en: "Monday" },
        { ar: "الثلاثاء", en: "Tuesday" },
        { ar: "الأربعاء", en: "Wednesday" },
        { ar: "الخميس", en: "Thursday" },
        { ar: "الجمعة", en: "Friday" }
    ];

    const getScheduleForDay = (dayAr) => {
        return workingHours?.find(wh => wh.day === dayAr);
    };

    return (
        <Card className="border-1 shadow-md border-blue-100 border-r-4 border-r-primary">
            <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-900 text-right">مواعيد العمل</h2>

                <div className="grid grid-cols-2 gap-3">
                    {daysOfWeek.map((day, index) => {
                        const schedule = getScheduleForDay(day.ar);
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
                                        {schedule.hours}
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
