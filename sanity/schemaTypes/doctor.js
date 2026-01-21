export default {
    name: 'doctor',
    title: 'الأطباء',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'اسم الطبيب',
            type: 'string',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'slug',
            title: 'الرابط',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'title',
            title: 'اللقب',
            type: 'string',
            description: 'مثل: دكتور، بروفيسور، استشاري',
        },
        {
            name: 'specialty',
            title: 'التخصص',
            type: 'reference',
            to: [{ type: 'specialty' }],
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'subSpecialties',
            title: 'التخصصات الفرعية',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'bio',
            title: 'نبذة عن الطبيب',
            type: 'text',
            rows: 4,
        },
        {
            name: 'description',
            title: 'الوصف التفصيلي',
            type: 'array',
            of: [{ type: 'block' }],
        },
        {
            name: 'image',
            title: 'صورة الطبيب',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'experienceYears',
            title: 'سنوات الخبرة',
            type: 'number',
            validation: (Rule) => Rule.min(0),
        },
        {
            name: 'qualifications',
            title: 'المؤهلات',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'degree', title: 'الدرجة', type: 'string' },
                        { name: 'institution', title: 'المؤسسة', type: 'string' },
                        { name: 'year', title: 'السنة', type: 'number' },
                    ],
                },
            ],
        },
        {
            name: 'certifications',
            title: 'الشهادات',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'languages',
            title: 'اللغات',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'العربية', value: 'ar' },
                    { title: 'الإنجليزية', value: 'en' },
                    { title: 'الفرنسية', value: 'fr' },
                    { title: 'الألمانية', value: 'de' },
                ],
            },
        },
        {
            name: 'hospitals',
            title: 'المستشفيات/العيادات',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'hospital',
                            title: 'المستشفى',
                            type: 'reference',
                            to: [{ type: 'hospital' }],
                        },
                        {
                            name: 'isPrimary',
                            title: 'المستشفى الرئيسي',
                            type: 'boolean',
                            initialValue: false,
                        },
                    ],
                },
            ],
        },
        {
            name: 'consultationFee',
            title: 'سعر الكشف',
            type: 'number',
            validation: (Rule) => Rule.min(0),
        },
        {
            name: 'followUpFee',
            title: 'سعر المتابعة',
            type: 'number',
            validation: (Rule) => Rule.min(0),
        },
        {
            name: 'availability',
            title: 'أوقات العمل',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'day',
                            title: 'اليوم',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'الأحد', value: 'sunday' },
                                    { title: 'الإثنين', value: 'monday' },
                                    { title: 'الثلاثاء', value: 'tuesday' },
                                    { title: 'الأربعاء', value: 'wednesday' },
                                    { title: 'الخميس', value: 'thursday' },
                                    { title: 'الجمعة', value: 'friday' },
                                    { title: 'السبت', value: 'saturday' },
                                ],
                            },
                        },
                        { name: 'startTime', title: 'وقت البداية', type: 'string' },
                        { name: 'endTime', title: 'وقت النهاية', type: 'string' },
                        {
                            name: 'hospital',
                            title: 'المستشفى',
                            type: 'reference',
                            to: [{ type: 'hospital' }],
                        },
                    ],
                },
            ],
        },
        {
            name: 'acceptsInsurance',
            title: 'يقبل التأمين',
            type: 'boolean',
            initialValue: false,
        },
        {
            name: 'insuranceProviders',
            title: 'شركات التأمين المقبولة',
            type: 'array',
            of: [{ type: 'string' }],
            hidden: ({ document }) => !document?.acceptsInsurance,
        },
        {
            name: 'rating',
            title: 'التقييم',
            type: 'number',
            readOnly: true,
            validation: (Rule) => Rule.min(0).max(5),
        },
        {
            name: 'reviewsCount',
            title: 'عدد التقييمات',
            type: 'number',
            readOnly: true,
            initialValue: 0,
        },
        {
            name: 'phone',
            title: 'رقم الهاتف',
            type: 'string',
        },
        {
            name: 'email',
            title: 'البريد الإلكتروني',
            type: 'string',
        },
        {
            name: 'clerkUserId',
            title: 'معرف المستخدم',
            type: 'string',
            description: 'Clerk User ID',
        },
        {
            name: 'isActive',
            title: 'نشط',
            type: 'boolean',
            initialValue: true,
        },
        {
            name: 'isVerified',
            title: 'موثق',
            type: 'boolean',
            initialValue: false,
        },
        {
            name: 'isFeatured',
            title: 'مميز',
            type: 'boolean',
            initialValue: false,
        },
        {
            name: 'order',
            title: 'الترتيب',
            type: 'number',
            hidden: ({ document }) => !document?.isFeatured,
        },
    ],
    preview: {
        select: {
            title: 'name',
            specialty: 'specialty.name',
            media: 'image',
            isActive: 'isActive',
        },
        prepare({ title, specialty, media, isActive }) {
            return {
                title,
                subtitle: `${specialty || 'لا يوجد تخصص'} ${!isActive ? '(غير نشط)' : ''}`,
                media,
            };
        },
    },
};
