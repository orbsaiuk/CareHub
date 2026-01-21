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
            type: 'string',
            description: 'اسم الأيقونة من React Icons (مثل: FaHeart)',
        },
        {
            name: 'image',
            title: 'الصورة',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'color',
            title: 'اللون',
            type: 'string',
            description: 'كود اللون (مثل: #3B82F6)',
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
            media: 'image',
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
