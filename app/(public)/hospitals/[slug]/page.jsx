import { notFound } from "next/navigation";
import { getHospitalBySlug } from "@/services/sanity/hospitals";
import { urlFor } from "@/sanity/lib/image";
import { HospitalHero, ContactCard, WorkingHoursSection, FacilitiesSection, DepartmentsSection, GallerySection, DoctorsSection, AboutSection } from "./_components";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const hospital = await getHospitalBySlug(decodedSlug);

    if (!hospital) {
        return {
            title: "المستشفى غير موجود"
        };
    }

    return {
        title: `${hospital.name} - ${hospital.type}`,
        description: hospital.description
    };
}

export default async function HospitalDetailPage({ params }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const hospital = await getHospitalBySlug(decodedSlug);

    if (!hospital) {
        notFound();
    }

    // Transform data to match component expectations
    const transformedHospital = {
        ...hospital,
        logo: hospital.logo ? urlFor(hospital.logo).url() : "/rectangle-1.svg",
        images: hospital.images?.map(img => urlFor(img).url()) || [],
        // Keep specialties as objects with name property for DepartmentsSection
        departments: hospital.specialties || [],
        // Transform facilities to ensure they have name property
        facilities: hospital.facilities?.map(f =>
            typeof f === 'string' ? { name: f } : f
        ) || [],
    };

    return (
        <div className="bg-gray-50/50 min-h-screen" dir="rtl">
            {/* Hero Section */}
            <HospitalHero hospital={transformedHospital} />

            {/* Main Content */}
            <div className="container mx-auto py-8">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <AboutSection description={hospital.description} />
                        <DepartmentsSection departments={transformedHospital.departments} />
                        <FacilitiesSection facilities={transformedHospital.facilities} />
                        <WorkingHoursSection workingHours={hospital.workingHours} />
                        <DoctorsSection doctors={hospital.doctors} />
                        <GallerySection images={transformedHospital.images} />
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <ContactCard hospital={transformedHospital} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
