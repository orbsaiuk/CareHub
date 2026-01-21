import { notFound } from "next/navigation";
import { HospitalHero, ContactCard, WorkingHoursSection, FacilitiesSection, DepartmentsSection, GallerySection, DoctorsSection, AboutSection } from "./_components";

// Mock data for single hospital
const getHospitalBySlug = (slug) => {
    const hospitals = {
        "hospital-0": {
            _id: "hospital-0",
            slug: "hospital-0",
            name: "مستشفى الملك فيصل التخصصي",
            type: "مستشفى حكومي",
            rating: 4.5,
            reviewsCount: 500,
            address: {
                city: "الرياض",
                street: "طريق الملك فهد",
                district: "العليا"
            },
            phone: "+966 11 442 7777",
            emergencyPhone: "+966 11 442 7777",
            description: "مستشفى الملك فيصل التخصصي ومركز الأبحاث هو مستشفى تخصصي رائد في المملكة العربية السعودية، يقدم أعلى مستويات الرعاية الصحية المتخصصة في مختلف المجالات الطبية.",
            specialties: [
                "جراحة القلب والأوعية الدموية",
                "زراعة الأعضاء",
                "الأورام",
                "طب الأطفال",
                "جراحة الأعصاب",
                "أمراض الكلى"
            ],
            facilities: [
                "غرف طوارئ",
                "صيدلية",
                "مواقف سيارات",
                "مرافق لذوي الاحتياجات الخاصة"
            ],
            workingHours: {
                weekdays: "24 ساعة",
                weekend: "24 ساعة",
                emergency: "متاح على مدار الساعة"
            },
            logo: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60",
            images: [
                "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=60"
            ]
        },
        "hospital-1": {
            _id: "hospital-1",
            slug: "hospital-1",
            name: "مستشفى دله",
            type: "مستشفى خاص",
            rating: 4.6,
            reviewsCount: 600,
            address: {
                city: "الرياض",
                street: "طريق الملك فهد",
                district: "النخيل"
            },
            phone: "+966 11 275 5555",
            emergencyPhone: "+966 11 275 5555",
            description: "مستشفى دله هو أحد أكبر المستشفيات الخاصة في المملكة، يوفر خدمات طبية متكاملة بأحدث التقنيات والكوادر الطبية المتميزة.",
            specialties: [
                "طب الأسنان التجميلي",
                "جراحة التجميل",
                "طب العيون",
                "العظام والمفاصل",
                "الجلدية والتجميل",
                "النساء والولادة"
            ],
            facilities: [
                "غرف طوارئ",
                "صيدلية",
                "مواقف سيارات",
                "مرافق لذوي الاحتياجات الخاصة"
            ],
            workingHours: {
                weekdays: "24 ساعة",
                weekend: "24 ساعة",
                emergency: "متاح على مدار الساعة"
            },
            logo: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=60",
            images: [
                "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=60"
            ]
        }
    };

    return hospitals[slug] || null;
};

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const hospital = getHospitalBySlug(slug);

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
    const hospital = getHospitalBySlug(slug);

    if (!hospital) {
        notFound();
    }

    return (
        <div className="bg-gray-50/50 min-h-screen" dir="rtl">
            {/* Hero Section */}
            <HospitalHero hospital={hospital} />

            {/* Main Content */}
            <div className="container mx-auto py-8">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <AboutSection description={hospital.description} />
                        <DepartmentsSection departments={hospital.specialties} />
                        <FacilitiesSection facilities={hospital.facilities} />
                        <WorkingHoursSection workingHours={hospital.workingHours} />
                        <DoctorsSection />
                        <GallerySection images={hospital.images} />
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <ContactCard hospital={hospital} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
