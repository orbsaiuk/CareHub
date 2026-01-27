export default function ContactInfoCard({ title, icon: Icon, children }) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary p-2 rounded-lg">
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            </div>
            <div className="text-gray-600 text-lg leading-relaxed">
                {children}
            </div>
        </div>
    );
}
