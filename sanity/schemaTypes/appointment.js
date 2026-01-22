export default {
    name: 'appointment',
    title: 'المواعيد',
    type: 'document',
    fields: [
        {
            name: 'appointmentNumber',
            title: 'رقم الموعد',
            type: 'string',
            readOnly: true,
        },
        {
            name: 'patient',
            title: 'المريض',
            type: 'object',
            fields: [
                { name: 'clerkUserId', title: 'معرف المستخدم', type: 'string' },
                { name: 'name', title: 'الاسم', type: 'string' },
                { name: 'phone', title: 'رقم الهاتف', type: 'string' },
                { name: 'email', title: 'البريد الإلكتروني', type: 'string' },
                { name: 'age', title: 'العمر', type: 'number' },
                {
                    name: 'gender', title: 'الجنس', type: 'string', options: {
                        list: [
                            { title: 'ذكر', value: 'male' },
                            { title: 'أنثى', value: 'female' },
                        ],
                    }
                },
            ],
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'doctor',
            title: 'الطبيب',
            type: 'reference',
            to: [{ type: 'doctor' }],
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'hospital',
            title: 'المستشفى/العيادة',
            type: 'reference',
            to: [{ type: 'hospital' }],
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'specialty',
            title: 'التخصص',
            type: 'reference',
            to: [{ type: 'specialty' }],
        },
        {
            name: 'appointmentDate',
            title: 'تاريخ الموعد',
            type: 'datetime',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'duration',
            title: 'المدة (بالدقائق)',
            type: 'number',
            initialValue: 30,
        },
        {
            name: 'type',
            title: 'نوع الموعد',
            type: 'string',
            options: {
                list: [
                    { title: 'كشف أولي', value: 'initial' },
                    { title: 'متابعة', value: 'followup' },
                    { title: 'استشارة', value: 'consultation' },
                    { title: 'فحص دوري', value: 'checkup' },
                    { title: 'طوارئ', value: 'emergency' },
                ],
            },
            initialValue: 'initial',
        },
        {
            name: 'reason',
            title: 'سبب الزيارة',
            type: 'text',
            rows: 3,
        },
        {
            name: 'symptoms',
            title: 'الأعراض',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'status',
            title: 'الحالة',
            type: 'string',
            options: {
                list: [
                    { title: 'قيد الانتظار', value: 'pending' },
                    { title: 'مؤكد', value: 'confirmed' },
                    { title: 'جاري', value: 'in_progress' },
                    { title: 'مكتمل', value: 'completed' },
                    { title: 'ملغي', value: 'cancelled' },
                    { title: 'لم يحضر', value: 'no_show' },
                ],
            },
            initialValue: 'pending',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'cancellationReason',
            title: 'سبب الإلغاء',
            type: 'text',
            hidden: ({ document }) => document?.status !== 'cancelled',
        },
        {
            name: 'fee',
            title: 'الرسوم',
            type: 'number',
            validation: (Rule) => Rule.min(0),
        },
        {
            name: 'paymentStatus',
            title: 'حالة الدفع',
            type: 'string',
            options: {
                list: [
                    { title: 'غير مدفوع', value: 'unpaid' },
                    { title: 'مدفوع', value: 'paid' },
                    { title: 'مسترد', value: 'refunded' },
                ],
            },
            initialValue: 'unpaid',
        },
        {
            name: 'paymentMethod',
            title: 'طريقة الدفع',
            type: 'string',
            options: {
                list: [
                    { title: 'نقدي', value: 'cash' },
                    { title: 'بطاقة ائتمان', value: 'card' },
                    { title: 'تأمين', value: 'insurance' },
                    { title: 'تحويل بنكي', value: 'transfer' },
                ],
            },
        },
        {
            name: 'insuranceInfo',
            title: 'معلومات التأمين',
            type: 'object',
            fields: [
                { name: 'provider', title: 'شركة التأمين', type: 'string' },
                { name: 'policyNumber', title: 'رقم البوليصة', type: 'string' },
                { name: 'coveragePercentage', title: 'نسبة التغطية', type: 'number' },
            ],
            hidden: ({ document }) => document?.paymentMethod !== 'insurance',
        },
        {
            name: 'notes',
            title: 'ملاحظات',
            type: 'text',
            rows: 3,
        },
        {
            name: 'doctorNotes',
            title: 'ملاحظات الطبيب',
            type: 'text',
            rows: 3,
        },
        {
            name: 'prescription',
            title: 'الوصفة الطبية',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'medication',
                    fields: [
                        { name: 'medication', title: 'الدواء', type: 'string' },
                        { name: 'dosage', title: 'الجرعة', type: 'string' },
                        { name: 'frequency', title: 'التكرار', type: 'string' },
                        { name: 'duration', title: 'المدة', type: 'string' },
                        { name: 'instructions', title: 'التعليمات', type: 'text' },
                    ],
                },
            ],
        },
        {
            name: 'followUpDate',
            title: 'موعد المتابعة',
            type: 'datetime',
        },
        {
            name: 'reminderSent',
            title: 'تم إرسال التذكير',
            type: 'boolean',
            initialValue: false,
        },
        {
            name: 'createdAt',
            title: 'تاريخ الإنشاء',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        },
        {
            name: 'updatedAt',
            title: 'تاريخ التحديث',
            type: 'datetime',
        },
    ],
    preview: {
        select: {
            patientName: 'patient.name',
            doctorName: 'doctor.name',
            date: 'appointmentDate',
            status: 'status',
        },
        prepare({ patientName, doctorName, date, status }) {
            const statusLabels = {
                pending: 'قيد الانتظار',
                confirmed: 'مؤكد',
                in_progress: 'جاري',
                completed: 'مكتمل',
                cancelled: 'ملغي',
                no_show: 'لم يحضر',
            };
            return {
                title: `${patientName} - ${doctorName}`,
                subtitle: `${new Date(date).toLocaleDateString('ar-SA')} - ${statusLabels[status]}`,
            };
        },
    },
};
