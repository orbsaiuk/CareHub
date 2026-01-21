import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingCard() {
    return (
        <Card className="shadow-md border-r-4 border-r-primary">
            <CardContent className="p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">هل لديك سؤال؟
                    </h2>
                    <p className="text-gray-600">تحدث مع الدكتور الآن واحصل على إجابة فورية
</p>
                </div>

                <Button className="w-full mb-3 bg-primary hover:bg-blue-700" size="lg">
                    اتصل الان
                </Button>

                <Button variant="outline" className="w-full border-primary text-primary hover:bg-blue-50 mb-2">
                    ابدا الاستشاره
                </Button>
            </CardContent>
        </Card>
    );
}
