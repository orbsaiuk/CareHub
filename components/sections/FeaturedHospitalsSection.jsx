import { HospitalCard } from "../cards/HospitalCard";

const hospitalData = [
  {
    id: 1,
    name: "مستشفى الملك فيصل التخصصي",
    rating: 4.9,
    reviewsCount: 234,
    location: "الرياض",
    imageUrl: "/rectangle-1.svg",
    type: "مستشفى حكومي",

  },
  {
    id: 2,
    name: "مستشفى دله",
    rating: 4.8,
    reviewsCount: 180,
    location: "الرياض",
    imageUrl: "/rectangle-1.svg",
    type: "مستشفى خاص",
  },
  {
    id: 3,
    name: "مستشفى الحبيب",
    rating: 4.9,
    reviewsCount: 350,
    location: "الرياض",
    imageUrl: "/rectangle-1.svg",
    type: "مستشفى خاص",
  },
];

export const FeaturedHospitalsSection = () => {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="flex flex-col items-center gap-4 text-center mb-16">
          <h2 className="font-bold text-neutral-950 text-4xl md:text-5xl tracking-tight leading-tight">
            المستشفيات والعيادات الشريكة
          </h2>

          <p className="font-normal text-gray-500 text-xl md:text-2xl tracking-normal leading-relaxed max-w-2xl">
            نتعاون مع أفضل المؤسسات الطبية في المملكة
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {hospitalData.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              {...hospital}
              className="w-full max-w-sm"
              reviewsCount={`(${hospital.reviewsCount})`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
