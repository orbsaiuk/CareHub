export default {
    name: 'hospital',
    title: 'المستشفيات والعيادات',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'اسم المنشأة',
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
            name: 'type',
            title: 'نوع المنشأة',
            type: 'string',
            options: {
                list: [
                    { title: 'مستشفى عام', value: 'general_hospital' },
                    { title: 'مستشفى تخصصي', value: 'specialized_hospital' },
                    { title: 'عيادة', value: 'clinic' },
                    { title: 'مركز طبي', value: 'medical_center' },
                    { title: 'مركز تشخيصي', value: 'diagnostic_center' },
                ],
            },
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'description',
            title: 'الوصف',
            type: 'text',
            rows: 4,
        },
        {
            name: 'detailedDescription',
            title: 'الوصف التفصيلي',
            type: 'array',
            of: [{ type: 'block' }],
        },
        {
            name: 'logo',
            title: 'الشعار',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'images',
            title: 'الصور',
            type: 'array',
            of: [{ type: 'image' }],
        },
        {
            name: 'specialties',
            title: 'التخصصات المتوفرة',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'specialty' }] }],
        },
        {
            name: 'services',
            title: 'الخدمات',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'facilities',
            title: 'المرافق',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'facility',
                    fields: [
                        { name: 'name', title: 'الاسم', type: 'string' },
                        { name: 'icon', title: 'الأيقونة', type: 'string' },
                    ],
                    preview: {
                        select: {
                            name: 'name',
                            icon: 'icon',
                        },
                        prepare({ name, icon }) {
                            return {
                                title: name || 'مرفق',
                                subtitle: icon || '',
                            };
                        },
                    },
                },
            ],
        },
        {
            name: 'address',
            title: 'العنوان',
            type: 'object',
            fields: [
                { name: 'street', title: 'الشارع', type: 'string' },
                { name: 'city', title: 'المدينة', type: 'string' },
                { name: 'region', title: 'المنطقة', type: 'string' },
                { name: 'country', title: 'الدولة', type: 'string', initialValue: 'السعودية' },
                { name: 'postalCode', title: 'الرمز البريدي', type: 'string' },
            ],
        },
        {
            name: 'location',
            title: 'الموقع الجغرافي',
            type: 'object',
            fields: [
                { name: 'lat', title: 'خط العرض', type: 'number' },
                { name: 'lng', title: 'خط الطول', type: 'number' },
            ],
        },
        {
            name: 'phone',
            title: 'رقم الهاتف',
            type: 'string',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'emergencyPhone',
            title: 'رقم الطوارئ',
            type: 'string',
        },
        {
            name: 'email',
            title: 'البريد الإلكتروني',
            type: 'string',
        },
        {
            name: 'website',
            title: 'الموقع الإلكتروني',
            type: 'url',
        },
        {
            name: 'workingHours',
            title: 'ساعات العمل',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'workingHour',
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
                        { name: 'isOpen', title: 'مفتوح', type: 'boolean', initialValue: true },
                        { name: 'openTime', title: 'وقت الفتح', type: 'string' },
                        { name: 'closeTime', title: 'وقت الإغلاق', type: 'string' },
                        { name: 'is24Hours', title: '24 ساعة', type: 'boolean', initialValue: false },
                    ],
                    preview: {
                        select: {
                            day: 'day',
                            isOpen: 'isOpen',
                            openTime: 'openTime',
                            closeTime: 'closeTime',
                            is24Hours: 'is24Hours',
                        },
                        prepare({ day, isOpen, openTime, closeTime, is24Hours }) {
                            const dayLabels = {
                                sunday: 'الأحد',
                                monday: 'الإثنين',
                                tuesday: 'الثلاثاء',
                                wednesday: 'الأربعاء',
                                thursday: 'الخميس',
                                friday: 'الجمعة',
                                saturday: 'السبت',
                            };

                            let subtitle = '';
                            if (!isOpen) {
                                subtitle = 'مغلق';
                            } else if (is24Hours) {
                                subtitle = '24 ساعة';
                            } else {
                                subtitle = `${openTime || ''} - ${closeTime || ''}`;
                            }

                            return {
                                title: dayLabels[day] || day,
                                subtitle,
                            };
                        },
                    },
                },
            ],
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
            name: 'clerkUserId',
            title: 'معرف المستخدم',
            type: 'string',
            description: 'Clerk User ID للمسؤول',
        },
        {
            name: 'isActive',
            title: 'نشط',
            type: 'boolean',
            initialValue: true,
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
            type: 'type',
            media: 'logo',
            isActive: 'isActive',
        },
        prepare({ title, type, media, isActive }) {
            const typeLabels = {
                general_hospital: 'مستشفى عام',
                specialized_hospital: 'مستشفى تخصصي',
                clinic: 'عيادة',
                medical_center: 'مركز طبي',
                diagnostic_center: 'مركز تشخيصي',
            };
            return {
                title,
                subtitle: `${typeLabels[type] || type} ${!isActive ? '(غير نشط)' : ''}`,
                media,
            };
        },
    },
};
