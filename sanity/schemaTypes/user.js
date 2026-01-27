export default {
    name: 'user',
    title: 'المستخدمين',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'الاسم',
            type: 'string',
        },
        {
            name: 'clerkId',
            title: 'معرف Clerk',
            type: 'string',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'email',
            title: 'البريد الإلكتروني',
            type: 'string',
        },
        {
            name: 'imageUrl',
            title: 'رابط الصورة',
            type: 'string', // Using string instead of url in case it's a relative path or data uri, though usually it's a URL
        },
        {
            name: 'role',
            title: 'الدور',
            type: 'string',
            options: {
                list: [
                    { title: 'مستخدم', value: 'user' },
                    { title: 'طبيب', value: 'doctor' },
                    { title: 'منشأة طبية', value: 'facility' },
                ],
            },
            initialValue: 'user',
        },
        {
            name: 'phone',
            title: 'رقم الهاتف',
            type: 'string',
        },
        {
            name: 'rating',
            title: 'تقييم المستخدم',
            type: 'number',
            description: 'متوسط تقييم الشركات للمستخدم',
            initialValue: 0,
            readOnly: true,
        },
        {
            name: 'ratingCount',
            title: 'عدد التقييمات',
            type: 'number',
            initialValue: 0,
            readOnly: true,
        }
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'email',
        }
    }
}
