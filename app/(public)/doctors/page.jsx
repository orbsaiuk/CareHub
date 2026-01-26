import Link from "next/link";
import {
    HeroSearchSection,
    FeatureBadges,
    PromotionalBanner,
} from "./_components";
import { DoctorsSearchView } from "./_components/DoctorsSearchView";
import { DoctorsBrowseView } from "./_components/DoctorsBrowseView";
import { getFeaturedSpecialties, getSpecialties } from "@/services/sanity/specialties";
import { getDoctorsBySpecialty, searchDoctorsWithFilters } from "@/services/sanity/doctors";
import { getAllCities } from "@/services/sanity/facilities";
import { getActivePromotionalBanners } from "@/services/sanity/promotionalBanners";

const ITEMS_PER_PAGE = 12;

// Get all active specialties for the search dropdown
async function getSearchSpecialties() {
    try {
        const specialties = await getSpecialties();
        return specialties.map(specialty => ({
            _id: specialty._id,
            name: specialty.name,
            slug: specialty.slug,
            icon: specialty.icon,
            doctorCount: specialty.doctorCount || 0
        }));
    } catch (error) {
        console.error('Error fetching all specialties:', error);
        return [];
    }
}

async function getSpecialtiesWithDoctorsData() {
    try {
        // Get featured specialties
        const specialties = await getFeaturedSpecialties(8);

        // For each specialty, fetch its doctors
        const specialtiesWithDoctors = await Promise.all(
            specialties.map(async (specialty) => {
                const doctors = await getDoctorsBySpecialty(specialty._id, 1, 3);

                return {
                    id: specialty._id,
                    _id: specialty._id,
                    name: specialty.name,
                    icon: specialty.icon,
                    count: specialty.doctorCount,
                    doctors: doctors.map(doctor => ({
                        _id: doctor._id,
                        slug: doctor.slug,
                        name: doctor.name,
                        specialty: doctor.specialty?.name || specialty.name,
                        rating: doctor.rating || 0,
                        reviewsCount: doctor.reviewsCount || 0,
                        experienceYears: doctor.experienceYears,
                        isAvailable: doctor.isActive,
                        facilities: doctor.facilities || [],
                        image: doctor.image,
                    }))
                };
            })
        );

        return specialtiesWithDoctors.filter(s => s.doctors.length > 0);
    } catch (error) {
        console.error('Error fetching specialties with doctors:', error);
        return [];
    }
}

export default async function DoctorsPage({ searchParams }) {
    const params = await searchParams || {};
    const searchTerm = params.search || "";
    const selectedSpecialtyName = params.specialty || "";
    const selectedCity = params.city || "";
    const page = parseInt(params.page) || 1;

    // Check if search mode is active
    const isSearchMode = searchTerm || selectedSpecialtyName || selectedCity || params.page;

    // Fetch common data
    const [allSpecialties, allCities] = await Promise.all([
        getSearchSpecialties(),
        getAllCities()
    ]);

    let searchResults = null;
    let specialtiesData = [];
    let promotionalBanners = [];
    let totalCount = 0;
    let totalPages = 0;

    if (isSearchMode) {
        const result = await searchDoctorsWithFilters({
            searchTerm,
            specialtyName: selectedSpecialtyName,
            city: selectedCity
        }, page, ITEMS_PER_PAGE);
        
        searchResults = result.doctors;
        totalCount = result.total;
        totalPages = result.totalPages;
    } else {
        const [specs, banners] = await Promise.all([
            getSpecialtiesWithDoctorsData(),
            getActivePromotionalBanners("all")
        ]);
        specialtiesData = specs;
        promotionalBanners = banners;
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 font-sans" dir="rtl">
            {/* Hero & Search Section */}
            <HeroSearchSection 
                specialties={allSpecialties.map(s => ({ value: s.name, label: s.name }))} 
                cities={allCities} 
            />

            {/* Content Section */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {isSearchMode ? (
                    <DoctorsSearchView
                        searchResults={searchResults}
                        totalCount={totalCount}
                        totalPages={totalPages}
                        currentPage={page}
                        allSpecialties={allSpecialties}
                        allCities={allCities}
                        searchTerm={searchTerm}
                        selectedSpecialtyName={selectedSpecialtyName}
                        selectedCity={selectedCity}
                    />
                ) : (
                    <DoctorsBrowseView
                        specialtiesData={specialtiesData}
                        promotionalBanners={promotionalBanners}
                    />
                )}
            </main>
        </div>
    );
}
