import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { FaHospital, FaUserMd, FaUsers, FaCheck } from "react-icons/fa";

const cardsData = [
  {
    icon: FaHospital,
    title: "للمستشفيات والعيادات",
    description: "أضف منشأتك الصحية وتواصل مع آلاف المرضى الباحثين عن خدماتك",
    features: [
      "صفحة تعريفية شاملة",
      "إدارة أطباء المنشأة",
      "نظام حجز متكامل",
      "إحصائيات وتحليلات",
    ],
    buttonText: "سجل منشاتك",
    hasButton: true,
  },
  {
    icon: FaUserMd,
    title: "للأطباء",
    description: "انضم إلى شبكتنا من الأطباء المعتمدين واستقبل مرضاك بكل سهولة",
    features: [
      "إدارة المواعيد بسهولة",
      "ملف شخصي احترافي",
      "تواصل مع مرضاك",
      "تقارير وإحصائيات مفصلة",
    ],
    buttonText: "سجل كطبيب",
    hasButton: true,
  },
  {
    icon: FaUsers,
    title: "للمرضى",
    description:
      "ابحث عن أفضل الأطباء، احجز موعدك بسهولة، وتابع سجلك الصحي من مكان واحد",
    features: [
      "بحث سريع عن الأطباء والتخصصات",
      "حجز المواعيد إلكترونيا",
      "سجل صحي إلكتروني",
      "تقييم الأطباء ومشاركة التجربة",
    ],
    buttonText: "سجل كمريض",
    hasButton: true,
  },
  ];

export const NewsletterSection = () => {
  return (
    <section className="relative w-full overflow-hidden py-16 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 mb-12">
          <h2 className="font-bold text-neutral-950 text-4xl md:text-5xl text-center leading-tight">
            منصة واحدة للجميع
          </h2>

          <p className="font-normal text-muted-foreground text-xl text-center max-w-3xl leading-relaxed">
            سواء كنت مريضا تبحث عن طبيب، أو طبيبا تريد توسيع قاعدة مرضاك، أو
            منشأة صحية تريد التميز
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
          {cardsData.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={index}
                className="bg-white rounded-2xl overflow-hidden border-none shadow-md h-full"
              >
                <CardContent className="flex flex-col h-full bg-white p-6 sm:p-8">
                  <div className="flex flex-col flex-1 gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-linear-bg flex items-center justify-center text-white">
                      <Icon className="w-8 h-8" />
                    </div>

                    <div className="space-y-4">
                      <h3 className="w-full font-bold text-neutral-950 text-2xl">
                        {card.title}
                      </h3>

                      <p className="w-full text-gray-500 text-lg leading-relaxed">
                        {card.description}
                      </p>
                     
                      {/* Features List with Checkmarks */}
                      <ul className="space-y-3 mt-4">
                         {card.features.map((feature, idx) => (
                           <li key={idx} className="flex items-center gap-2 text-gray-600">
                              <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                 <FaCheck className="w-3 h-3 text-green-500" />
                              </div>
                              <span className="text-sm">{feature}</span>
                           </li>
                         ))}
                      </ul>
                    </div>
                  </div>

                  {card.hasButton && (
                    <div className="pt-8 mt-auto">
                      <Button className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20">
                        {card.buttonText}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
