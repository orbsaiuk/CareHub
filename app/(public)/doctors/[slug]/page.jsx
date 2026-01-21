import { notFound } from "next/navigation";
import {
    DoctorHero,
    BookingCard,
    AboutSection,
    QualificationsSection,
    WorkingHoursSection,
    ReviewsSection
} from "./_components";

// Mock data for single doctor
const getDoctorBySlug = (slug) => {
    const doctors = {
        "doctor-0": {
            _id: "doctor-0",
            slug: "doctor-0",
            name: "د. أحمد محمود",
            specialty: "طب القلب",
            rating: 4.8,
            reviewsCount: 120,
            experienceYears: 15,
            consultationFee: 200,
            isAvailable: true,
            bio: "استشاري أمراض القلب والأوعية الدموية مع خبرة تزيد عن 15 عامًا في تشخيص وعلاج أمراض القلب. حاصل على البورد السعودي والزمالة الكندية في طب القلب.",
            qualifications: [
                "بكالوريوس الطب والجراحة - جامعة الملك سعود",
                "البورد السعودي في أمراض القلب",
                "الزمالة الكندية في طب القلب التداخلي",
                "عضو الجمعية السعودية لأمراض القلب"
            ],
            specializations: [
                "قسطرة القلب التشخيصية والعلاجية",
                "تركيب الدعامات القلبية",
                "علاج اضطرابات نظم القلب",
                "تخطيط القلب والإيكو"
            ],
            hospitals: [
                {
                    hospital: {
                        name: "مستشفى الملك فيصل التخصصي",
                        slug: "hospital-0",
                        address: {
                            city: "الرياض",
                            street: "طريق الملك فهد"
                        }
                    }
                }
            ],
            workingHours: [
                { day: "الأحد", hours: "9:00 ص - 5:00 م" },
                { day: "الإثنين", hours: "9:00 ص - 5:00 م" },
                { day: "الثلاثاء", hours: "9:00 ص - 5:00 م" },
                { day: "الأربعاء", hours: "9:00 ص - 5:00 م" },
                { day: "الخميس", hours: "9:00 ص - 1:00 م" }
            ],
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&auto=format&fit=crop&q=60"
        },
        "doctor-1": {
            _id: "doctor-1",
            slug: "doctor-1",
            name: "د. سارة خالد",
            specialty: "طب الأسنان",
            rating: 4.9,
            reviewsCount: 130,
            experienceYears: 12,
            consultationFee: 250,
            isAvailable: true,
            bio: "استشارية طب وجراحة الأسنان مع خبرة واسعة في التجميل والزراعة. متخصصة في علاج الأسنان بدون ألم باستخدام أحدث التقنيات.",
            qualifications: [
                "بكالوريوس طب وجراحة الفم والأسنان",
                "ماجستير في تجميل الأسنان",
                "دبلوم في زراعة الأسنان",
                "عضو الجمعية السعودية لطب الأسنان"
            ],
            hospitals: [
                {
                    hospital: {
                        name: "مستشفى دله",
                        slug: "hospital-1",
                        address: {
                            city: "الرياض",
                            street: "طريق الملك فهد"
                        }
                    }
                }
            ],
            workingHours: [
                { day: "الأحد", hours: "10:00 ص - 6:00 م" },
                { day: "الإثنين", hours: "10:00 ص - 6:00 م" },
                { day: "الثلاثاء", hours: "10:00 ص - 6:00 م" },
                { day: "الأربعاء", hours: "10:00 ص - 6:00 م" },
                { day: "الخميس", hours: "10:00 ص - 2:00 م" }
            ],
            image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&auto=format&fit=crop&q=60"
        }
    };

    return doctors[slug] || null;
};

export async function generateMetadata({ params }) {
    const doctor = getDoctorBySlug(params.slug);

    if (!doctor) {
        return {
            title: "الطبيب غير موجود"
        };
    }

    return {
        title: `${doctor.name} - ${doctor.specialty}`,
        description: doctor.bio
    };
}

export default function DoctorDetailPage({ params }) {
    const doctor = getDoctorBySlug(params.slug);

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
                        <AboutSection bio={doctor.bio} />

                        {/* Qualifications */}
                        <QualificationsSection qualifications={doctor.qualifications} />

                        {/* Working Hours */}
                        <WorkingHoursSection workingHours={doctor.workingHours} />

                        {/* Reviews */}
                        <ReviewsSection />
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
