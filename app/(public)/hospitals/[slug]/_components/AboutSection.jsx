"use client";

import { Card, CardContent } from "@/components/ui/card";

export function AboutSection({ description }) {
    return (
        <Card className="border-1 shadow-md border-r-4 border-r-primary">
            <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">عن المستشفى</h2>
                <p className="text-gray-700 text-justify text-lg">
                    {description || "المركز الطبي الدولي هو مستشفى خاص مشهور منذ عام 2000 ومتواجد على مدار الساعة في الرياض. يقدم الرعاية الصحية الشاملة والخدمات الطبية والجراحات الدقيقة والأقسام التخصصي في كافةالمجالات."}
                </p>
            </CardContent>
        </Card>
    );
}
