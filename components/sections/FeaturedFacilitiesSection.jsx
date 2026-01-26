import { FacilityCard } from "../cards/FacilityCard";
import { client } from "@/sanity/lib/client";
import { getFeaturedFacilitiesQuery } from "@/sanity/queries/facilities";

async function getFeaturedFacilities() {
  try {
    const facilities = await client.fetch(getFeaturedFacilitiesQuery, { limit: 3 });
    return facilities || [];
  } catch (error) {
    console.error('Error fetching featured facilities:', error);
    return [];
  }
}

export const FeaturedFacilitiesSection = async () => {
  const facilities = await getFeaturedFacilities();

  if (facilities.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="flex flex-col items-center gap-4 text-center mb-16">
          <h2 className="font-bold text-neutral-950 text-4xl md:text-5xl tracking-tight leading-tight">
            المنشآت الطبية الشريكة
          </h2>

          <p className="font-normal text-gray-500 text-xl md:text-2xl tracking-normal leading-relaxed max-w-2xl">
            نتعاون مع أفضل المؤسسات الطبية 
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {facilities.map((facility) => (
            <FacilityCard
              key={facility._id}
              slug={facility.slug}
              name={facility.name}
              rating={facility.rating}
              reviewsCount={facility.reviewsCount}
              location={facility.address?.city ? `${facility.address.city}${facility.address.street ? ' - ' + facility.address.street : ''}` : ''}
              logo={facility.logo}
              className="w-full max-w-sm"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
