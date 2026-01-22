import { SpecialtyCard } from "@/components/cards/SpecialtyCard";
import { ListingLayout } from "@/components/shared/ListingLayout";
import { client } from "@/sanity/lib/client";
import { getSpecialtiesQuery } from "@/sanity/queries/specialties";

const ITEMS_PER_PAGE = 6;

async function getSpecialties() {
    try {
        const specialties = await client.fetch(getSpecialtiesQuery);
        return specialties || [];
    } catch (error) {
        console.error('Error fetching specialties:', error);
        return [];
    }
}

export default async function SpecialtiesPage({ searchParams }) {
    const specialties = await getSpecialties();
    const params = await searchParams;
    const currentPage = parseInt(params?.page || '1');

    // Calculate pagination
    const totalPages = Math.ceil(specialties.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentSpecialties = specialties.slice(startIndex, endIndex);

    return (
        <ListingLayout
            title="التخصصات الطبية"
            subtitle="اختر التخصص المناسب لحالتك الصحية"
            searchPlaceholder="ابحث عن تخصص طبي..."
            sectionTitle="جميع التخصصات"
            sectionSubtitle="استكشف التخصصات الطبية المتاحة"
            currentPage={currentPage}
            totalPages={totalPages}
            className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        >
            {currentSpecialties.map((specialty) => (
                <SpecialtyCard
                    key={specialty._id}
                    _id={specialty._id}
                    slug={specialty.slug}
                    name={specialty.name}
                    icon={specialty.icon}
                    doctorCount={specialty.doctorCount}
                />
            ))}
        </ListingLayout>
    );
}
