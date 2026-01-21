import { Card, CardContent } from "../ui/card";
import { Star, BadgeCheck, CalendarCheck, CreditCard, Headphones, Smartphone } from "lucide-react";

const features = [
  {
    icon: Star,
    title: "تقييمات حقيقية",
    description: "اطلع على تقييمات المرضى السابقين لاختيار الطبيب المناسب",
  },
  {
    icon: BadgeCheck,
    title: "أطباء معتمدون",
    description:
      "جميع الأطباء مرخصون ومعتمدون من الهيئة السعودية للتخصصات الصحية",
  },
  {
    icon: CalendarCheck,
    title: "حجز فوري",
    description: "احجز موعدك في ثوان واحصل على تأكيد فوري دون انتظار",
  },
  {
    icon: CreditCard,
    title: "دفع آمن",
    description: "خيارات دفع متعددة وآمنة تناسب الجميع",
  },
  {
    icon: Headphones,
    title: "دعم متواصل",
    description: "فريق الدعم متاح للمساعدة والإجابة على جميع استفساراتك",
  },
  {
    icon: Smartphone,
    title: "سهولة الوصول",
    description: "احجز من أي مكان وفي أي وقت عبر الهاتف أو الكمبيوتر",
  },
];

export const FeaturesOverviewSection = () => {
  return (
    <section className="relative w-full py-20">

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-center gap-4 mb-20">
          <h2 className="font-bold text-neutral-950 text-4xl md:text-5xl text-center leading-tight">
            لماذا تختار منصتنا؟
          </h2>
          <p className="font-normal text-gray-500 text-xl md:text-2xl text-center leading-relaxed max-w-3xl">
            نوفر لك تجربة حجز طبي متميزة وآمنة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 place-items-center">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="bg-white rounded-2xl shadow-lg transition-shadow duration-300 border border-gray-100 w-full max-w-md h-full"
              >
                <CardContent className="flex flex-col items-start gap-6 p-8 h-full">
                  <div className="p-4 bg-linear-bg rounded-2xl">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="w-full text-right flex flex-col gap-3">
                    <h3 className="font-bold text-neutral-950 text-2xl leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-lg font-normal leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
