import { Button } from "../ui/button";
import { SpecialtyCard } from "../cards/SpecialtyCard";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { getFeaturedSpecialtiesQuery } from "@/sanity/queries/specialties";

async function getSpecialties() {
  try {
    const specialties = await client.fetch(getFeaturedSpecialtiesQuery, { limit: 1000 });
    return specialties || [];
  } catch (error) {
    console.error('Error fetching specialties:', error);
    return [];
  }
}

export const SpecialtiesSection = async () => {
  const specialties = await getSpecialties();

  if (specialties.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col items-center gap-4 mb-16 px-4">
          <h2 className="font-bold text-neutral-950 text-4xl md:text-5xl text-center leading-tight">
            استكشف التخصصات المتاحة
          </h2>

          <p className="font-normal text-muted-foreground text-xl text-center max-w-2xl leading-relaxed">
            نوفر لك مجموعة واسعة من التخصصات الطبية مع أفضل الأطباء المعتمدين
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center mx-auto">
          {specialties.map((specialty) => (
            <SpecialtyCard
              key={specialty._id}
              _id={specialty._id}
              slug={specialty.slug}
              name={specialty.name}
              icon={specialty.icon}
              doctorCount={specialty.doctorCount}
            />
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button className="h-14 px-10 rounded-xl text-xl font-medium shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <Link href="/specialties">
              عرض جميع التخصصات
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
