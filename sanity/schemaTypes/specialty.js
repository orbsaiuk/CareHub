export default {
    name: 'specialty',
    title: 'التخصصات الطبية',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'اسم التخصص',
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
            name: 'nameEn',
            title: 'الاسم بالإنجليزية',
            type: 'string',
        },
        {
            name: 'description',
            title: 'الوصف',
            type: 'text',
            rows: 3,
        },
        {
            name: 'icon',
            title: 'الأيقونة',
            type: 'image',
            description: 'أيقونة التخصص (SVG بلون أبيض)',
            options: {
                hotspot: true,
                accept: 'image/svg+xml',
            },
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'parentSpecialty',
            title: 'التخصص الرئيسي',
            type: 'reference',
            to: [{ type: 'specialty' }],
            description: 'للتخصصات الفرعية فقط',
        },
        {
            name: 'commonConditions',
            title: 'الحالات الشائعة',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'الأمراض أو الحالات التي يعالجها هذا التخصص',
        },
        {
            name: 'order',
            title: 'الترتيب',
            type: 'number',
            description: 'ترتيب العرض في القائمة',
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
            description: 'عرض في الصفحة الرئيسية',
        },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'nameEn',
            media: 'icon',
            isActive: 'isActive',
        },
        prepare({ title, subtitle, media, isActive }) {
            return {
                title,
                subtitle: `${subtitle || ''} ${!isActive ? '(غير نشط)' : ''}`,
                media,
            };
        },
    },
};
