import { Card, CardContent } from "../ui/card";
import { FaSearch, FaRegCalendarCheck, FaFileMedical, FaUserMd } from "react-icons/fa";

const stepsData = [
  {
    id: 1,
    number: "1",
    title: "ابحث عن الطبيب المناسب",
    description:
      "استخدم محرك البحث للعثور على الطبيب أو التخصص الذي تحتاجه في مدينتك",
    icon: FaSearch,
  },
  {
    id: 2,
    number: "2",
    title: "اختر الموعد المناسب",
    description: "تصفح المواعيد المتاحة واختر التاريخ والوقت الذي يناسبك",
    icon: FaRegCalendarCheck,
  },
  {
    id: 3,
    number: "3",
    title: "احجز موعدك",
    description: "أكمل البيانات المطلوبة واحصل على تأكيد فوري لحجزك",
    icon: FaFileMedical,
  },
  {
    id: 4,
    number: "4",
    title: "احضر الموعد",
    description: "احضر في الوقت المحدد واستمتع بخدمة طبية عالية الجودة",
    icon: FaUserMd,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="relative w-full overflow-hidden py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 mb-12">
          <h2 className="font-bold text-neutral-950 text-4xl md:text-5xl text-center leading-tight">
            احجز موعدك في 4 خطوات
          </h2>
          <p className="font-normal text-muted-foreground text-xl text-center max-w-2xl">
            عملية بسيطة وسريعة للحصول على الرعاية الصحية التي تحتاجها
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mx-auto">
          {stepsData.map((step) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.id}
                className="relative bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-shadow h-full"
              >
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="flex flex-col items-center p-8 flex-1 text-center">
                    <div className="w-20 h-20 mb-6 flex items-center justify-center bg-linear-bg rounded-2xl text-white shadow-inner">
                        <Icon className="w-9 h-9" />
                    </div>
                    
                    <h3 className="font-bold text-neutral-950 text-xl leading-tight mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">
                      {step.description}
                    </p>
                  </div>

                  <div
                    className={`absolute -top-3 -right-3 flex w-12 h-12 justify-center items-center rounded-2xl bg-linear-bg shadow-md`}
                  >
                    <span className="font-bold text-white text-lg pt-2 pr-1">
                      {step.number}
                    </span>
                  </div>

                  <div className={`w-full h-1.5 bg-linear-bg`} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
