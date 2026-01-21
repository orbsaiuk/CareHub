export function FeatureBadges() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 justify-center gap-6 mb-12 max-w-5xl mx-auto">
            <div className="flex flex-col space-y-2 shadow-md p-4 rounded-md">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    1
                </div>
                <h3 className="text-lg font-bold text-gray-900">نوع الطبيب</h3>
                <p className="text-gray-500">اختر من بين الأطباء العامين والمتخصصين</p>
            </div>
            <div className="flex flex-col space-y-2 shadow-md p-4 rounded-md">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    2
                </div>
                <h3 className="text-lg font-bold text-gray-900">قيم الطبيب</h3>
                <p className="text-gray-500">قيمون تجاربك مع الأطباء</p>
            </div>
            <div className="flex flex-col space-y-2 shadow-md p-4 rounded-md">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    3
                </div>
                <h3 className="text-lg font-bold text-gray-900">احجز على الاستشارة</h3>
                <p className="text-gray-500">النظام الطبي المتقدم والاستشاري</p>
            </div>
        </div>
    );
}
