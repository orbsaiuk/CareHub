import { HospitalCard } from "@/components/cards/HospitalCard";
import { ListingLayout } from "@/components/shared/ListingLayout";
import { client } from "@/sanity/lib/client";
import { getHospitalsQuery, getHospitalsCountQuery } from "@/sanity/queries/hospitals";

const ITEMS_PER_PAGE = 9;

async function getHospitals(page = 1) {
    try {
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;

        const [hospitals, total] = await Promise.all([
            client.fetch(getHospitalsQuery, { start, end }),
            client.fetch(getHospitalsCountQuery)
        ]);

        return { hospitals: hospitals || [], total: total || 0 };
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        return { hospitals: [], total: 0 };
    }
}

export default async function HospitalsPage({ searchParams }) {
    const params = await searchParams;
    const currentPage = parseInt(params?.page || '1');
    const { hospitals, total } = await getHospitals(currentPage);
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    return (
        <ListingLayout
            title="المستشفيات والعيادات"
            subtitle="منشآت طبية معتمدة بأحدث التجهيزات والكوادر الطبية المتميزة"
            searchPlaceholder="ابحث عن مستشفى أو عيادة..."
            sectionTitle="المستشفيات المتاحة"
            sectionSubtitle="اختر من بين أفضل المنشآت الطبية"
            currentPage={currentPage}
            totalPages={totalPages}
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
            {hospitals.map((hospital) => (
                <HospitalCard
                    key={hospital._id}
                    slug={hospital.slug}
                    name={hospital.name}
                    rating={hospital.rating}
                    reviewsCount={hospital.reviewsCount}
                    location={`${hospital.address?.city || ''} - ${hospital.address?.street || ''}`}
                    imageUrl={hospital.logo}
                />
            ))}
        </ListingLayout>
    );
}
