const { createClient } = require('@sanity/client');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_ADMIN_TOKEN,
  useCdn: false,
});

const facilities = [
  {
    _type: 'facility',
    name: 'مستشفى الملك فيصل التخصصي',
    slug: { _type: 'slug', current: 'king-faisal-specialist-hospital' },
    type: 'hospital',
    description: 'أحد أرقى المستشفيات التخصصية في المملكة العربية السعودية، يقدم خدمات طبية عالمية المستوى.',
    phone: '920012345',
    emergencyPhone: '937',
    address: {
      street: 'طريق مكة المكرمة',
      city: 'الرياض',
      region: 'منطقة الرياض',
      country: 'السعودية',
      postalCode: '11564'
    },
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 1250,
    services: ['القلب', 'الأورام', 'الأعصاب', 'الجراحة العامة'],
    workingHours: [
      { day: 'sunday', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { day: 'monday', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { day: 'tuesday', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { day: 'wednesday', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { day: 'thursday', isOpen: true, openTime: '08:00', closeTime: '17:00' },
    ]
  },
  {
    _type: 'facility',
    name: 'مركز كير الطبي',
    slug: { _type: 'slug', current: 'care-medical-center' },
    type: 'clinic',
    description: 'مركز طبي متكامل يضم نخبة من الأطباء في مختلف التخصصات الطبية.',
    phone: '920055667',
    address: {
      street: 'طريق الملك عبدالله',
      city: 'جدة',
      region: 'منطقة مكة المكرمة',
      country: 'السعودية'
    },
    isActive: true,
    isFeatured: true,
    rating: 4.7,
    reviewsCount: 850,
    services: ['العيون', 'الأسنان', 'الجلدية', 'الأطفال'],
    workingHours: [
      { day: 'sunday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'monday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'tuesday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'wednesday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'thursday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'saturday', isOpen: true, openTime: '10:00', closeTime: '20:00' },
    ]
  },
  {
    _type: 'facility',
    name: 'مستشفى سليمان الحبيب',
    slug: { _type: 'slug', current: 'sulaiman-al-habib-hospital' },
    type: 'hospital',
    description: 'مجموعة طبية رائدة توفر رعاية صحية شاملة باستخدام أحدث التقنيات الطبية.',
    phone: '920000011',
    emergencyPhone: '920000011',
    address: {
      street: 'طريق الملك فهد',
      city: 'الرياض',
      region: 'منطقة الرياض',
      country: 'السعودية'
    },
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 5400,
    services: ['الطوارئ', 'الأشعة', 'المختبر', 'العيادات الخارجية'],
    workingHours: [
      { day: 'sunday', isOpen: true, is24Hours: true },
      { day: 'monday', isOpen: true, is24Hours: true },
      { day: 'tuesday', isOpen: true, is24Hours: true },
      { day: 'wednesday', isOpen: true, is24Hours: true },
      { day: 'thursday', isOpen: true, is24Hours: true },
      { day: 'friday', isOpen: true, is24Hours: true },
      { day: 'saturday', isOpen: true, is24Hours: true },
    ]
  },
  {
    _type: 'facility',
    name: 'مركز الصفوة الطبي',
    slug: { _type: 'slug', current: 'al-safwa-medical-center' },
    type: 'clinic',
    description: 'مركز متخصص في خدمات الرعاية الأولية والتحاليل الطبية.',
    phone: '0123456789',
    address: {
      street: 'حي المروج',
      city: 'الرياض',
      region: 'منطقة الرياض',
      country: 'السعودية'
    },
    isActive: true,
    isFeatured: false,
    rating: 4.5,
    reviewsCount: 320,
    services: ['الرعاية الأولية', 'المختبرات'],
    workingHours: [
      { day: 'sunday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
      { day: 'monday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
      { day: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
      { day: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
      { day: 'thursday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    ]
  }
];

async function seed() {
  console.log('Starting seed process...');
  
  try {
    for (const facility of facilities) {
      console.log(`Creating/Updating facility: ${facility.name}`);
      await client.createOrReplace(facility);
    }
    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
  }
}

seed();
