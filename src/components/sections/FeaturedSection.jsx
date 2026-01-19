import { DoctorCard } from "../cards/DoctorCard";

const doctorCards = [
  {
    id: 1,
    name: "د. أحمد محمود",
    specialty: "طب القلب",
    experienceYears: 15,
    rating: 4.9,
    reviewsCount: 234,
    price: 350,
    hospitalName: "مستشفى الملك فيصل التخصصي - الرياض",
    isAvailable: true,
    imageUrl: "/image-----------------3.png",
  },
  {
    id: 2,
    name: "د. خالد علي",
    specialty: "طب الأسنان",
    experienceYears: 12,
    rating: 4.8,
    reviewsCount: 150,
    price: 250,
    hospitalName: "عيادات الأسنان الحديثة - الرياض",
    isAvailable: true,
    imageUrl: "/image-----------------3.png",
  },
  {
    id: 3,
    name: "د. سارة محمد",
    specialty: "طب الأطفال",
    experienceYears: 10,
    rating: 4.9,
    reviewsCount: 300,
    price: 200,
    hospitalName: "مستشفى الأطفال التخصصي - جدة",
    isAvailable: true,
    imageUrl: "/image-----------------3.png",
  },
  {
    id: 4,
    name: "د. محمد حسن",
    specialty: "طب العيون",
    experienceYears: 18,
    rating: 4.7,
    reviewsCount: 120,
    price: 300,
    hospitalName: "مستشفى العيون - الدمام",
    isAvailable: false,
    imageUrl: "/image-----------------3.png",
  },
];

export const FeaturedSection = () => {
  return (
    <section className="w-full py-20 bg-gray-50/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <header className="flex flex-col items-center gap-4 mb-16">
          <h1 className="font-bold text-neutral-950 text-4xl md:text-5xl text-center leading-tight">
            تواصل مع أفضل الأطباء
          </h1>
          <p className="font-normal text-muted-foreground text-xl text-center tracking-normal">
            اختر من بين نخبة من الأطباء المعتمدين في مختلف التخصصات
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
          {doctorCards.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              {...doctor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
