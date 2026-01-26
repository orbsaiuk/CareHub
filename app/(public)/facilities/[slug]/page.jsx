import { notFound } from "next/navigation";
import { getFacilityBySlug } from "@/services/sanity/facilities";
import { urlFor } from "@/sanity/lib/image";
import { FacilityHero, ContactCard, WorkingHoursSection, FacilitiesSection, DepartmentsSection, GallerySection, DoctorsSection, AboutSection } from "./_components";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const facility = await getFacilityBySlug(decodedSlug);

    if (!facility) {
        return {
            title: "المنشأة غير موجودة"
        };
    }

    return {
        title: `${facility.name} - ${facility.type}`,
        description: facility.description
    };
}

export default async function FacilityDetailPage({ params }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const facility = await getFacilityBySlug(decodedSlug);

    if (!facility) {
        notFound();
    }

    // Transform data to match component expectations
    const transformedFacility = {
        ...facility,
        logo: facility.logo ? urlFor(facility.logo).url() : "/rectangle-1.svg",
        images: facility.images?.map(img => urlFor(img).url()) || [],
        // Keep specialties as objects with name property for DepartmentsSection
        departments: facility.specialties || [],
        // Transform facilities to ensure they have name property
        facilities: facility.facilities?.map(f =>
            typeof f === 'string' ? { name: f } : f
        ) || [],
    };

    return (
        <div className="bg-gray-50/50 min-h-screen" dir="rtl">
            {/* Hero Section */}
            <FacilityHero facility={transformedFacility} />

            {/* Main Content */}
            <div className="container mx-auto py-8">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <AboutSection description={facility.description} />
                        <DepartmentsSection departments={transformedFacility.departments} />
                        <FacilitiesSection facilities={transformedFacility.facilities} />
                        <WorkingHoursSection workingHours={facility.workingHours} />
                        <DoctorsSection doctors={facility.doctors} />
                        <GallerySection images={transformedFacility.images} />
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <ContactCard facility={transformedFacility} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
