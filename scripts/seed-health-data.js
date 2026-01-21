/**
 * Seed Health Data Script
 * 
 * This script helps you create sample data for the health platform.
 * Run this after setting up Sanity schemas.
 * 
 * Usage:
 * 1. Make sure Sanity is running
 * 2. Update the SANITY_PROJECT_ID and SANITY_DATASET in your .env
 * 3. Run: node scripts/seed-health-data.js
 */

const specialtiesData = [
    {
        name: 'طب القلب',
        nameEn: 'Cardiology',
        icon: 'FaHeart',
        color: '#EF4444',
        description: 'تشخيص وعلاج أمراض القلب والأوعية الدموية',
        isFeatured: true,
        order: 1,
    },
    {
        name: 'طب الأسنان',
        nameEn: 'Dentistry',
        icon: 'FaTooth',
        color: '#3B82F6',
        description: 'العناية بصحة الفم والأسنان',
        isFeatured: true,
        order: 2,
    },
    {
        name: 'طب العيون',
        nameEn: 'Ophthalmology',
        icon: 'FaEye',
        color: '#10B981',
        description: 'تشخيص وعلاج أمراض العيون',
        isFeatured: true,
        order: 3,
    },
    {
        name: 'طب الأطفال',
        nameEn: 'Pediatrics',
        icon: 'FaBaby',
        color: '#F59E0B',
        description: 'الرعاية الصحية للأطفال والرضع',
        isFeatured: true,
        order: 4,
    },
    {
        name: 'طب الباطنة',
        nameEn: 'Internal Medicine',
        icon: 'FaStethoscope',
        color: '#8B5CF6',
        description: 'تشخيص وعلاج الأمراض الباطنية',
        isFeatured: true,
        order: 5,
    },
    {
        name: 'الجراحة العامة',
        nameEn: 'General Surgery',
        icon: 'FaSyringe',
        color: '#EC4899',
        description: 'العمليات الجراحية العامة',
        isFeatured: true,
        order: 6,
    },
    {
        name: 'طب النساء والولادة',
        nameEn: 'Obstetrics & Gynecology',
        icon: 'FaFemale',
        color: '#F472B6',
        description: 'الرعاية الصحية للنساء والحوامل',
        isFeatured: true,
        order: 7,
    },
    {
        name: 'طب العظام',
        nameEn: 'Orthopedics',
        icon: 'FaBone',
        color: '#6366F1',
        description: 'علاج أمراض وإصابات العظام والمفاصل',
        isFeatured: true,
        order: 8,
    },
];

const hospitalTypesData = [
    {
        name: 'مستشفى الملك فيصل التخصصي',
        type: 'specialized_hospital',
        description: 'مستشفى تخصصي رائد في المملكة',
        address: {
            street: 'شارع الملك فيصل',
            city: 'الرياض',
            region: 'الرياض',
            country: 'السعودية',
        },
        phone: '+966112345678',
        hasEmergency: true,
        acceptsInsurance: true,
        isFeatured: true,
        order: 1,
    },
    {
        name: 'مستشفى الملك خالد الجامعي',
        type: 'general_hospital',
        description: 'مستشفى جامعي متكامل',
        address: {
            street: 'طريق الملك عبدالعزيز',
            city: 'الرياض',
            region: 'الرياض',
            country: 'السعودية',
        },
        phone: '+966112345679',
        hasEmergency: true,
        acceptsInsurance: true,
        isFeatured: true,
        order: 2,
    },
];

const sampleDoctorsData = [
    {
        name: 'د. أحمد محمود',
        title: 'استشاري',
        bio: 'استشاري أمراض القلب مع خبرة 15 عاماً في التشخيص والعلاج',
        experienceYears: 15,
        consultationFee: 350,
        followUpFee: 200,
        languages: ['ar', 'en'],
        acceptsInsurance: true,
        isFeatured: true,
        order: 1,
    },
    {
        name: 'د. سارة خالد',
        title: 'دكتورة',
        bio: 'طبيبة أسنان متخصصة في التجميل والزراعة',
        experienceYears: 10,
        consultationFee: 300,
        followUpFee: 150,
        languages: ['ar', 'en'],
        acceptsInsurance: true,
        isFeatured: true,
        order: 2,
    },
];

console.log('='.repeat(60));
console.log('Health Platform - Sample Data Reference');
console.log('='.repeat(60));
console.log('\n📋 Use this data to create documents in Sanity Studio:\n');

console.log('1️⃣  SPECIALTIES (التخصصات الطبية)');
console.log('-'.repeat(60));
specialtiesData.forEach((specialty, index) => {
    console.log(`\n${index + 1}. ${specialty.name} (${specialty.nameEn})`);
    console.log(`   Icon: ${specialty.icon}`);
    console.log(`   Color: ${specialty.color}`);
    console.log(`   Description: ${specialty.description}`);
});

console.log('\n\n2️⃣  HOSPITALS (المستشفيات)');
console.log('-'.repeat(60));
hospitalTypesData.forEach((hospital, index) => {
    console.log(`\n${index + 1}. ${hospital.name}`);
    console.log(`   Type: ${hospital.type}`);
    console.log(`   City: ${hospital.address.city}`);
    console.log(`   Emergency: ${hospital.hasEmergency ? 'Yes' : 'No'}`);
});

console.log('\n\n3️⃣  SAMPLE DOCTORS (الأطباء)');
console.log('-'.repeat(60));
sampleDoctorsData.forEach((doctor, index) => {
    console.log(`\n${index + 1}. ${doctor.name} (${doctor.title})`);
    console.log(`   Experience: ${doctor.experienceYears} years`);
    console.log(`   Fee: ${doctor.consultationFee} SAR`);
    console.log(`   Languages: ${doctor.languages.join(', ')}`);
});

console.log('\n\n📝 NEXT STEPS:');
console.log('-'.repeat(60));
console.log('1. Open Sanity Studio: http://localhost:3000/studio');
console.log('2. Create specialties first (التخصصات الطبية)');
console.log('3. Create hospitals (المستشفيات والعيادات)');
console.log('4. Create doctors and link them to specialties and hospitals');
console.log('5. Test the API endpoints:');
console.log('   - GET /api/health/doctors');
console.log('   - GET /api/health/doctors/[slug]');
console.log('\n' + '='.repeat(60));

// Export data for programmatic use
module.exports = {
    specialtiesData,
    hospitalTypesData,
    sampleDoctorsData,
};
