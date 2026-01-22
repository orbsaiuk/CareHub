import { HospitalCard } from "../cards/HospitalCard";
import { client } from "@/sanity/lib/client";
import { getFeaturedHospitalsQuery } from "@/sanity/queries/hospitals";

async function getFeaturedHospitals() {
  try {
    const hospitals = await client.fetch(getFeaturedHospitalsQuery, { limit: 3 });
    return hospitals || [];
  } catch (error) {
    console.error('Error fetching featured hospitals:', error);
    return [];
  }
}

export const FeaturedHospitalsSection = async () => {
  const hospitals = await getFeaturedHospitals();

  if (hospitals.length === 0) {
    return null;
  }

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
          {hospitals.map((hospital) => (
            <HospitalCard
              key={hospital._id}
              slug={hospital.slug}
              name={hospital.name}
              rating={hospital.rating}
              reviewsCount={hospital.reviewsCount}
              location={hospital.address?.city ? `${hospital.address.city}${hospital.address.street ? ' - ' + hospital.address.street : ''}` : ''}
              logo={hospital.logo}
              className="w-full max-w-sm"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
