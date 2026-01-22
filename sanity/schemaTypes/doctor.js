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
                    name: 'qualification',
                    fields: [
                        { name: 'degree', title: 'الدرجة', type: 'string' },
                        { name: 'institution', title: 'المؤسسة', type: 'string' },
                        { name: 'year', title: 'السنة', type: 'number' },
                    ],
                    preview: {
                        select: {
                            degree: 'degree',
                            institution: 'institution',
                            year: 'year',
                        },
                        prepare({ degree, institution, year }) {
                            return {
                                title: degree || 'مؤهل',
                                subtitle: `${institution || ''} ${year ? `- ${year}` : ''}`,
                            };
                        },
                    },
                },
            ],
        },
        {
            name: 'hospitals',
            title: 'المستشفيات/العيادات',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'hospitalAssignment',
                    fields: [
                        {
                            name: 'hospital',
                            title: 'المستشفى',
                            type: 'reference',
                            to: [{ type: 'hospital' }],
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'isPrimary',
                            title: 'المستشفى الرئيسي',
                            type: 'boolean',
                            initialValue: false,
                        },
                    ],
                    preview: {
                        select: {
                            hospitalName: 'hospital.name',
                            isPrimary: 'isPrimary',
                        },
                        prepare({ hospitalName, isPrimary }) {
                            return {
                                title: hospitalName || 'لم يتم اختيار مستشفى',
                                subtitle: isPrimary ? '⭐ المستشفى الرئيسي' : 'مستشفى إضافي',
                            };
                        },
                    },
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
                    name: 'availabilitySlot',
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
                    preview: {
                        select: {
                            day: 'day',
                            startTime: 'startTime',
                            endTime: 'endTime',
                            hospitalName: 'hospital.name',
                        },
                        prepare({ day, startTime, endTime, hospitalName }) {
                            const dayLabels = {
                                sunday: 'الأحد',
                                monday: 'الإثنين',
                                tuesday: 'الثلاثاء',
                                wednesday: 'الأربعاء',
                                thursday: 'الخميس',
                                friday: 'الجمعة',
                                saturday: 'السبت',
                            };
                            return {
                                title: `${dayLabels[day] || day}: ${startTime || ''} - ${endTime || ''}`,
                                subtitle: hospitalName || 'لم يتم تحديد المستشفى',
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
