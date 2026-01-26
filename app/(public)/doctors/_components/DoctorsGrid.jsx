
import { DoctorCard } from "@/components/cards/DoctorCard";

export function DoctorsGrid({ doctors }) {
    if (!doctors || doctors.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
    );
}
