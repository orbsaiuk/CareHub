import { DoctorCard } from "../cards/DoctorCard";
import { client } from "@/sanity/lib/client";
import { getFeaturedDoctorsQuery } from "@/sanity/queries/doctors";

async function getFeaturedDoctors() {
  try {
    const doctors = await client.fetch(getFeaturedDoctorsQuery, { limit: 4 });
    return doctors || [];
  } catch (error) {
    console.error('Error fetching featured doctors:', error);
    return [];
  }
}

export const FeaturedDoctorsSection = async () => {
  const doctors = await getFeaturedDoctors();

  if (doctors.length === 0) {
    return null;
  }

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
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              slug={doctor.slug}
              name={doctor.name}
              specialty={doctor.specialty?.name}
              rating={doctor.rating}
              reviewsCount={doctor.reviewsCount}
              experienceYears={doctor.experienceYears}
              facilities={doctor.facilities}
              image={doctor.image}
              isAvailable={doctor.isActive}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
