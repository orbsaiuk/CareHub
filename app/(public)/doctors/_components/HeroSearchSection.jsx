"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ChevronDown } from "lucide-react";

export function HeroSearchSection() {
    return (
        <div className="relative bg-primary/10 pt-24 pb-16 px-4">
            <div className="max-w-4xl mx-auto text-center space-y-4 mb-10">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
                    ابحث عن طبيبك المناسب
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    أكثر من 2,500 طبيب معتمد جاهزون لخدمتك في جميع التخصصات الطبية
                </p>
            </div>

            {/* Floating Search Bar */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row items-stretch md:items-center gap-2 border border-blue-50 relative z-10">
                    {/* Search Input */}
                    <div className="flex-1 relative flex items-center px-4 bg-gray-50/50 rounded-xl md:bg-transparent md:rounded-none">
                        <Search className="w-5 h-5 text-gray-400 ml-3" />
                        <Input
                            type="text"
                            placeholder="ابحث عن طبيب، تخصص، أو مستشفى..."
                            className="border-none shadow-none focus-visible:ring-0 bg-transparent text-gray-800 placeholder:text-gray-400 h-12 text-base w-full"
                        />
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-8 bg-gray-200 mx-2"></div>

                    {/* Specialty/Category Dropdown */}
                    <div className="relative flex items-center px-4 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors h-12 md:w-48 group">
                        <span className="text-gray-500 text-sm ml-auto">جميع التخصصات</span>
                        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-8 bg-gray-200 mx-2"></div>

                    {/* Location Dropdown */}
                    <div className="relative flex items-center px-4 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors h-12 md:w-48 group">
                        <MapPin className="w-4 h-4 text-gray-400 ml-2 group-hover:text-primary transition-colors" />
                        <span className="text-gray-500 text-sm ml-auto">اختر المدينة</span>
                        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>

                    {/* Search Button */}
                    <Button className="h-12 px-8 rounded-xl bg-blue-500 hover:bg-primary text-white font-bold text-base active:scale-95">
                        بحث
                    </Button>
                </div>
            </div>
        </div>
    );
}
