const { writeClient: client } = require('./serverClient.js');

// Sample facilities data
const facilitiesData = [
    {
        name: 'مستشفى الملك فيصل التخصصي',
        type: 'hospital',
        description: 'مستشفى متخصص في الرعاية الطبية المتقدمة والجراحات المعقدة',
        detailedDescription: [
            {
                _type: 'block',
                children: [
                    {
                        _type: 'span',
                        text: 'مستشفى الملك فيصل التخصصي هو واحد من أرقى المستشفيات في المملكة العربية السعودية، يقدم خدمات طبية متميزة في جميع التخصصات الطبية.'
                    }
                ]
            }
        ],
        services: [
            'جراحة القلب',
            'زراعة الأعضاء',
            'الأورام',
            'طب الأطفال',
            'النساء والولادة'
        ],
        facilities: [
            { name: 'غرف عمليات متطورة', icon: 'surgery' },
            { name: 'وحدة العناية المركزة', icon: 'icu' },
            { name: 'مختبرات طبية', icon: 'lab' },
            { name: 'صيدلية', icon: 'pharmacy' },
            { name: 'موقف سيارات', icon: 'parking' }
        ],
        address: {
            street: 'شارع الملك فيصل',
            city: 'الرياض',
            region: 'منطقة الرياض',
            country: 'السعودية',
            postalCode: '11211'
        },
        location: {
            lat: 24.7136,
            lng: 46.6753
        },
        phone: '+966114647272',
        emergencyPhone: '+966114647200',
        email: 'info@kfshrc.edu.sa',
        website: 'https://www.kfshrc.edu.sa',
        workingHours: [
            { day: 'sunday', isOpen: true, openTime: '08:00', closeTime: '22:00', is24Hours: false },
            { day: 'monday', isOpen: true, openTime: '08:00', closeTime: '22:00', is24Hours: false },
            { day: 'tuesday', isOpen: true, openTime: '08:00', closeTime: '22:00', is24Hours: false },
            { day: 'wednesday', isOpen: true, openTime: '08:00', closeTime: '22:00', is24Hours: false },
            { day: 'thursday', isOpen: true, openTime: '08:00', closeTime: '22:00', is24Hours: false },
            { day: 'friday', isOpen: true, openTime: '14:00', closeTime: '22:00', is24Hours: false },
            { day: 'saturday', isOpen: true, openTime: '08:00', closeTime: '22:00', is24Hours: false }
        ],
        rating: 4.8,
        reviewsCount: 1250,
        isActive: true,
        isFeatured: true,
        order: 1
    },
    {
        name: 'مستشفى الملك عبدالعزيز الجامعي',
        type: 'hospital',
        description: 'مستشفى جامعي يقدم خدمات طبية شاملة وتعليم طبي متميز',
        detailedDescription: [
            {
                _type: 'block',
                children: [
                    {
                        _type: 'span',
                        text: 'مستشفى الملك عبدالعزيز الجامعي يجمع بين الرعاية الطبية المتقدمة والتعليم الطبي، ويضم نخبة من الأطباء والاستشاريين.'
                    }
                ]
            }
        ],
        services: [
            'الطب الباطني',
            'الجراحة العامة',
            'طب الأطفال',
            'النساء والولادة',
            'طب الطوارئ'
        ],
        facilities: [
            { name: 'قسم الطوارئ', icon: 'emergency' },
            { name: 'العيادات الخارجية', icon: 'clinic' },
            { name: 'الأشعة التشخيصية', icon: 'radiology' },
            { name: 'المختبرات', icon: 'lab' },
            { name: 'الصيدلية', icon: 'pharmacy' }
        ],
        address: {
            street: 'طريق الملك عبدالعزيز',
            city: 'جدة',
            region: 'منطقة مكة المكرمة',
            country: 'السعودية',
            postalCode: '21589'
        },
        location: {
            lat: 21.4858,
            lng: 39.1925
        },
        phone: '+966126401000',
        emergencyPhone: '+966126401911',
        email: 'info@kauh.edu.sa',
        website: 'https://www.kauh.edu.sa',
        workingHours: [
            { day: 'sunday', isOpen: true, openTime: '07:00', closeTime: '23:00', is24Hours: false },
            { day: 'monday', isOpen: true, openTime: '07:00', closeTime: '23:00', is24Hours: false },
            { day: 'tuesday', isOpen: true, openTime: '07:00', closeTime: '23:00', is24Hours: false },
            { day: 'wednesday', isOpen: true, openTime: '07:00', closeTime: '23:00', is24Hours: false },
            { day: 'thursday', isOpen: true, openTime: '07:00', closeTime: '23:00', is24Hours: false },
            { day: 'friday', isOpen: true, openTime: '15:00', closeTime: '23:00', is24Hours: false },
            { day: 'saturday', isOpen: true, openTime: '07:00', closeTime: '23:00', is24Hours: false }
        ],
        rating: 4.5,
        reviewsCount: 890,
        isActive: true,
        isFeatured: true,
        order: 2
    },
    {
        name: 'عيادات الدكتور سليمان الحبيب',
        type: 'clinic',
        description: 'مجموعة عيادات طبية متخصصة تقدم خدمات طبية عالية الجودة',
        detailedDescription: [
            {
                _type: 'block',
                children: [
                    {
                        _type: 'span',
                        text: 'عيادات الدكتور سليمان الحبيب تقدم خدمات طبية متميزة في بيئة مريحة وحديثة مع أحدث التقنيات الطبية.'
                    }
                ]
            }
        ],
        services: [
            'طب الأسرة',
            'الطب الباطني',
            'طب الأطفال',
            'النساء والولادة',
            'طب الأسنان'
        ],
        facilities: [
            { name: 'عيادات متخصصة', icon: 'clinic' },
            { name: 'مختبر طبي', icon: 'lab' },
            { name: 'صيدلية', icon: 'pharmacy' },
            { name: 'استقبال مريح', icon: 'reception' },
            { name: 'موقف سيارات', icon: 'parking' }
        ],
        address: {
            street: 'طريق الملك فهد',
            city: 'الرياض',
            region: 'منطقة الرياض',
            country: 'السعودية',
            postalCode: '12382'
        },
        location: {
            lat: 24.7744,
            lng: 46.7383
        },
        phone: '+966114216666',
        email: 'info@drsulaimanalhabib.com',
        website: 'https://www.drsulaimanalhabib.com',
        workingHours: [
            { day: 'sunday', isOpen: true, openTime: '08:00', closeTime: '22:00', is24Hours: false },
            { day: 'monday', isOpen: true, openTime: '08:00', closeTime: '22:00', is24Hours: false },
            { day: 'tuesday', isOpen: true, openTime: '08:00', closeTime: '22:00', is24Hours: false },
            { day: 'wednesday', isOpen: true, openTime: '08:00', closeTime: '22:00', is24Hours: false },
            { day: 'thursday', isOpen: true, openTime: '08:00', closeTime: '22:00', is24Hours: false },
            { day: 'friday', isOpen: true, openTime: '16:00', closeTime: '22:00', is24Hours: false },
            { day: 'saturday', isOpen: true, openTime: '08:00', closeTime: '22:00', is24Hours: false }
        ],
        rating: 4.6,
        reviewsCount: 567,
        isActive: true,
        isFeatured: false
    },
    {
        name: 'مستشفى الأمير سلطان للقلب',
        type: 'hospital',
        description: 'مستشفى متخصص في أمراض وجراحة القلب والأوعية الدموية',
        detailedDescription: [
            {
                _type: 'block',
                children: [
                    {
                        _type: 'span',
                        text: 'مستشفى الأمير سلطان للقلب هو مركز طبي متخصص في علاج أمراض القلب والأوعية الدموية بأحدث التقنيات العالمية.'
                    }
                ]
            }
        ],
        services: [
            'جراحة القلب المفتوح',
            'القسطرة القلبية',
            'جراحة الأوعية الدموية',
            'طب القلب التداخلي',
            'زراعة القلب'
        ],
        facilities: [
            { name: 'غرف عمليات القلب', icon: 'surgery' },
            { name: 'وحدة القسطرة', icon: 'catheter' },
            { name: 'العناية المركزة للقلب', icon: 'icu' },
            { name: 'مختبرات متخصصة', icon: 'lab' },
            { name: 'صيدلية', icon: 'pharmacy' }
        ],
        address: {
            street: 'شارع الأمير سلطان',
            city: 'الرياض',
            region: 'منطقة الرياض',
            country: 'السعودية',
            postalCode: '11196'
        },
        location: {
            lat: 24.6877,
            lng: 46.7219
        },
        phone: '+966114279999',
        emergencyPhone: '+966114279911',
        email: 'info@pscc.med.sa',
        website: 'https://www.pscc.med.sa',
        workingHours: [
            { day: 'sunday', isOpen: true, openTime: '00:00', closeTime: '23:59', is24Hours: true },
            { day: 'monday', isOpen: true, openTime: '00:00', closeTime: '23:59', is24Hours: true },
            { day: 'tuesday', isOpen: true, openTime: '00:00', closeTime: '23:59', is24Hours: true },
            { day: 'wednesday', isOpen: true, openTime: '00:00', closeTime: '23:59', is24Hours: true },
            { day: 'thursday', isOpen: true, openTime: '00:00', closeTime: '23:59', is24Hours: true },
            { day: 'friday', isOpen: true, openTime: '00:00', closeTime: '23:59', is24Hours: true },
            { day: 'saturday', isOpen: true, openTime: '00:00', closeTime: '23:59', is24Hours: true }
        ],
        rating: 4.9,
        reviewsCount: 2100,
        isActive: true,
        isFeatured: true,
        order: 3
    },
    {
        name: 'عيادة الأسنان المتقدمة',
        type: 'clinic',
        description: 'عيادة متخصصة في طب وجراحة الأسنان بأحدث التقنيات',
        detailedDescription: [
            {
                _type: 'block',
                children: [
                    {
                        _type: 'span',
                        text: 'عيادة الأسنان المتقدمة تقدم جميع خدمات طب الأسنان من العلاج التحفظي إلى الجراحة والتجميل بأحدث الأجهزة.'
                    }
                ]
            }
        ],
        services: [
            'علاج الأسنان التحفظي',
            'جراحة الفم والأسنان',
            'تقويم الأسنان',
            'زراعة الأسنان',
            'تجميل الأسنان'
        ],
        facilities: [
            { name: 'عيادات أسنان حديثة', icon: 'dental' },
            { name: 'أجهزة أشعة رقمية', icon: 'xray' },
            { name: 'معمل أسنان', icon: 'lab' },
            { name: 'غرفة جراحة', icon: 'surgery' },
            { name: 'استقبال مريح', icon: 'reception' }
        ],
        address: {
            street: 'شارع التحلية',
            city: 'جدة',
            region: 'منطقة مكة المكرمة',
            country: 'السعودية',
            postalCode: '23425'
        },
        location: {
            lat: 21.5169,
            lng: 39.2192
        },
        phone: '+966126651234',
        email: 'info@advanceddental.sa',
        website: 'https://www.advanceddental.sa',
        workingHours: [
            { day: 'sunday', isOpen: true, openTime: '09:00', closeTime: '21:00', is24Hours: false },
            { day: 'monday', isOpen: true, openTime: '09:00', closeTime: '21:00', is24Hours: false },
            { day: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '21:00', is24Hours: false },
            { day: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '21:00', is24Hours: false },
            { day: 'thursday', isOpen: true, openTime: '09:00', closeTime: '21:00', is24Hours: false },
            { day: 'friday', isOpen: false, openTime: '', closeTime: '', is24Hours: false },
            { day: 'saturday', isOpen: true, openTime: '09:00', closeTime: '21:00', is24Hours: false }
        ],
        rating: 4.4,
        reviewsCount: 324,
        isActive: true,
        isFeatured: false
    }
];

// Function to generate slug from Arabic name
function generateSlug(name) {
    return name
        .toLowerCase()
        .replace(/[أإآ]/g, 'ا')
        .replace(/[ة]/g, 'ه')
        .replace(/[ى]/g, 'ي')
        .replace(/\s+/g, '-')
        .replace(/[^\u0600-\u06FF\w-]/g, '')
        .trim();
}

// Function to seed facilities
async function seedFacilities() {
    console.log('🏥 Starting facilities seeding...');

    try {
        // First, let's get existing specialties to reference
        const specialties = await client.fetch(`*[_type == "specialty" && isActive == true]`);
        console.log(`📋 Found ${specialties.length} specialties to reference`);

        const results = [];

        for (const facilityData of facilitiesData) {
            console.log(`🔄 Processing: ${facilityData.name}`);

            // Generate slug
            const slug = generateSlug(facilityData.name);

            // Check if facility already exists
            const existingFacility = await client.fetch(
                `*[_type == "facility" && slug.current == $slug][0]`,
                { slug }
            );

            if (existingFacility) {
                console.log(`⚠️  Facility with slug "${slug}" already exists, skipping...`);
                continue;
            }

            // Randomly assign some specialties (2-4 specialties per facility)
            const randomSpecialties = specialties
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 3) + 2)
                .map(specialty => ({ _type: 'reference', _ref: specialty._id }));

            // Create facility document
            const facilityDoc = {
                _type: 'facility',
                name: facilityData.name,
                slug: {
                    _type: 'slug',
                    current: slug
                },
                type: facilityData.type,
                description: facilityData.description,
                detailedDescription: facilityData.detailedDescription,
                services: facilityData.services,
                facilities: facilityData.facilities,
                address: facilityData.address,
                location: facilityData.location,
                phone: facilityData.phone,
                emergencyPhone: facilityData.emergencyPhone,
                email: facilityData.email,
                website: facilityData.website,
                workingHours: facilityData.workingHours,
                specialties: randomSpecialties,
                rating: facilityData.rating,
                reviewsCount: facilityData.reviewsCount,
                isActive: facilityData.isActive,
                isFeatured: facilityData.isFeatured,
                order: facilityData.order
            };

            // Create the document
            const result = await client.create(facilityDoc);
            results.push(result);

            console.log(`✅ Created facility: ${facilityData.name} (ID: ${result._id})`);
        }

        console.log(`🎉 Successfully seeded ${results.length} facilities!`);
        console.log('📊 Summary:');
        results.forEach((result, index) => {
            console.log(`   ${index + 1}. ${result.name} - ${result.type}`);
        });

    } catch (error) {
        console.error('❌ Error seeding facilities:', error);
        throw error;
    }
}

// Run the seeding function
if (require.main === module) {
    seedFacilities()
        .then(() => {
            console.log('✨ Seeding completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Seeding failed:', error);
            process.exit(1);
        });
}

module.exports = { seedFacilities };