import { Bone, Heart, Baby, Smile } from "lucide-react";

export const specialtiesData = [
    {
        id: 1,
        name: "طب العظام",
        icon: Bone,
        count: 3,
        doctors: [
            {
                _id: "doctor-1",
                slug: "doctor-1",
                name: "د. أحمد محمود",
                specialty: "طب العظام",
                rating: 4.8,
                reviewsCount: 234,
                consultationFee: 350,
                isAvailable: true,
                location: "الرياض",
                hospitals: [{ hospital: { name: "مستشفى الملك فيصل التخصصي - الرياض" } }],
                image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=60"
            },
            {
                _id: "doctor-2",
                slug: "doctor-2",
                name: "د. سارة خالد",
                specialty: "طب العظام",
                rating: 4.9,
                reviewsCount: 189,
                consultationFee: 400,
                isAvailable: true,
                location: "جدة",
                hospitals: [{ hospital: { name: "مستشفى الملك عبدالعزيز - جدة" } }],
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=60"
            },
            {
                _id: "doctor-3",
                slug: "doctor-3",
                name: "د. محمد العلي",
                specialty: "طب العظام",
                rating: 4.7,
                reviewsCount: 156,
                consultationFee: 300,
                isAvailable: false,
                location: "الرياض",
                hospitals: [{ hospital: { name: "مستشفى الحبيب - الرياض" } }],
                image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=60"
            }
        ]
    },
    {
        id: 2,
        name: "طب القلب",
        icon: Heart,
        count: 3,
        doctors: [
            {
                _id: "doctor-4",
                slug: "doctor-4",
                name: "د. فاطمة أحمد",
                specialty: "طب القلب",
                rating: 4.9,
                reviewsCount: 312,
                consultationFee: 450,
                isAvailable: true,
                location: "الرياض",
                hospitals: [{ hospital: { name: "مستشفى الملك فيصل التخصصي - الرياض" } }],
                image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&auto=format&fit=crop&q=60"
            },
            {
                _id: "doctor-5",
                slug: "doctor-5",
                name: "د. خالد السعيد",
                specialty: "طب القلب",
                rating: 4.8,
                reviewsCount: 278,
                consultationFee: 400,
                isAvailable: true,
                location: "جدة",
                hospitals: [{ hospital: { name: "مستشفى السعودي الألماني - جدة" } }],
                image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=60"
            },
            {
                _id: "doctor-6",
                slug: "doctor-6",
                name: "د. نورة المطيري",
                specialty: "طب القلب",
                rating: 4.7,
                reviewsCount: 201,
                consultationFee: 380,
                isAvailable: true,
                location: "الدمام",
                hospitals: [{ hospital: { name: "مستشفى الموسى - الدمام" } }],
                image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&auto=format&fit=crop&q=60"
            }
        ]
    },
    {
        id: 3,
        name: "طب الأطفال",
        icon: Baby,
        count: 3,
        doctors: [
            {
                _id: "doctor-7",
                slug: "doctor-7",
                name: "د. عبدالله الشمري",
                specialty: "طب الأطفال",
                rating: 4.9,
                reviewsCount: 445,
                consultationFee: 300,
                isAvailable: true,
                location: "الرياض",
                hospitals: [{ hospital: { name: "مستشفى الحبيب - الرياض" } }],
                image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=60"
            },
            {
                _id: "doctor-8",
                slug: "doctor-8",
                name: "د. ريم الحربي",
                specialty: "طب الأطفال",
                rating: 4.8,
                reviewsCount: 389,
                consultationFee: 280,
                isAvailable: true,
                location: "جدة",
                hospitals: [{ hospital: { name: "مستشفى باقدو - جدة" } }],
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=60"
            },
            {
                _id: "doctor-9",
                slug: "doctor-9",
                name: "د. يوسف القحطاني",
                specialty: "طب الأطفال",
                rating: 4.7,
                reviewsCount: 267,
                consultationFee: 320,
                isAvailable: false,
                location: "الرياض",
                hospitals: [{ hospital: { name: "مستشفى الملك فيصل التخصصي - الرياض" } }],
                image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=60"
            }
        ]
    },
    {
        id: 4,
        name: "طب الأسنان",
        icon: Smile,
        count: 3,
        doctors: [
            {
                _id: "doctor-10",
                slug: "doctor-10",
                name: "د. منى العتيبي",
                specialty: "طب الأسنان",
                rating: 4.8,
                reviewsCount: 198,
                consultationFee: 250,
                isAvailable: true,
                location: "الرياض",
                hospitals: [{ hospital: { name: "عيادات الأسنان المتقدمة - الرياض" } }],
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=60"
            },
            {
                _id: "doctor-11",
                slug: "doctor-11",
                name: "د. سعد الدوسري",
                specialty: "طب الأسنان",
                rating: 4.9,
                reviewsCount: 234,
                consultationFee: 300,
                isAvailable: true,
                location: "جدة",
                hospitals: [{ hospital: { name: "مركز الأسنان الأوروبي - جدة" } }],
                image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=60"
            },
            {
                _id: "doctor-12",
                slug: "doctor-12",
                name: "د. هند الغامدي",
                specialty: "طب الأسنان",
                rating: 4.7,
                reviewsCount: 176,
                consultationFee: 280,
                isAvailable: true,
                location: "الدمام",
                hospitals: [{ hospital: { name: "مجمع الأسنان الطبي - الدمام" } }],
                image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&auto=format&fit=crop&q=60"
            }
        ]
    }
];
