import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PromotionalBanner({ title, subtitle, link }) {
    return (
        <Card className="relative overflow-hidden rounded-2xl border-none shadow-sm h-40 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 my-8">
            {/* Animated dots pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                    animation: 'float 20s ease-in-out infinite'
                }}></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-between px-8" dir="rtl">
                <div className="flex-1 text-right">
                    <h3 className="text-white font-bold text-2xl mb-2">{title}</h3>
                    <p className="text-blue-200 text-sm">{subtitle}</p>
                </div>
                <Badge className="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-2 text-sm font-bold rounded-full cursor-pointer">
                    {link}
                </Badge>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </Card>
    );
}
