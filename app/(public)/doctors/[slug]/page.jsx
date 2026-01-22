import { notFound } from "next/navigation";
import { writeClient } from "@/sanity/lib/serverClient";
import { getDoctorBySlugQuery } from "@/sanity/queries/doctors";
import {
    DoctorHero,
    BookingCard,
    AboutSection,
    QualificationsSection,
    WorkingHoursSection,
    ReviewsSection
} from "./_components";

async function getDoctorBySlug(slug) {
    try {
        const doctor = await writeClient.fetch(getDoctorBySlugQuery, { slug });
        return doctor;
    } catch (error) {
        console.error("Error fetching doctor:", error);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const doctor = await getDoctorBySlug(decodedSlug);

    if (!doctor) {
        return {
            title: "الطبيب غير موجود"
        };
    }

    return {
        title: `${doctor.name} - ${doctor.specialty?.name || 'طبيب'}`,
        description: doctor.bio || `${doctor.name} - ${doctor.specialty?.name || 'طبيب'}`
    };
}

export default async function DoctorDetailPage({ params }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const doctor = await getDoctorBySlug(decodedSlug);

    if (!doctor) {
        notFound();
    }

    return (
        <div className="bg-gray-50/30 min-h-screen">
            <div className="container mx-auto py-8">
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Hero Section */}
                        <DoctorHero doctor={doctor} />

                        {/* About Section */}
                        <AboutSection bio={doctor.bio} specializations={doctor.subSpecialties} />

                        {/* Qualifications */}
                        <QualificationsSection qualifications={doctor.qualifications} />

                        {/* Working Hours */}
                        <WorkingHoursSection availability={doctor.availability} />

                        {/* Reviews */}
                        <ReviewsSection reviews={doctor.reviews} rating={doctor.rating} reviewsCount={doctor.reviewsCount} />
                    </div>

                    {/* Right Column - Sticky Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20">
                            <BookingCard consultationFee={doctor.consultationFee} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
