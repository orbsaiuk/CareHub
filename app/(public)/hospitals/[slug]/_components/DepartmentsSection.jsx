"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    HiOutlineHeart,
    HiOutlineLightningBolt,
    HiOutlineUserGroup,
    HiOutlineEye,
    HiOutlineBeaker,
    HiOutlineClipboardList
} from "react-icons/hi";
import {
    RiStethoscopeLine,
    RiMentalHealthLine,
    RiHeartPulseLine,
    RiLungsLine,
    RiSyringeLine,
    RiMicroscopeLine
} from "react-icons/ri";

// Map specialty names to icons
const getSpecialtyIcon = (name) => {
    const iconMap = {
        "قلب": RiHeartPulseLine,
        "طوارئ": HiOutlineLightningBolt,
        "أعصاب": RiMentalHealthLine,
        "عظام": HiOutlineClipboardList,
        "عيون": HiOutlineEye,
        "أسنان": HiOutlineUserGroup,
        "أطفال": HiOutlineUserGroup,
        "صدر": RiLungsLine,
        "أشعة": RiMicroscopeLine,
        "جراحة": RiSyringeLine,
        "زراعة": HiOutlineBeaker,
        "أورام": RiMicroscopeLine,
    };

    // Find matching icon based on keywords in the name
    for (const [keyword, Icon] of Object.entries(iconMap)) {
        if (name.includes(keyword)) {
            return Icon;
        }
    }

    // Default icon
    return RiStethoscopeLine;
};

export function DepartmentsSection({ departments = [] }) {
    const defaultDepartments = [
        "قسم الطوارئ",
        "قسم القلب",
        "قسم الأعصاب",
        "قسم العظام",
        "قسم العيون",
        "قسم الأسنان",
    ];

    const displayDepartments = departments.length > 0 ? departments : defaultDepartments;

    return (
        <Card className="border-1 border-r-4 border-r-primary">
            <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">الأقسام الطبية</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {displayDepartments.map((dept, index) => {
                        const deptName = dept.name || dept;
                        const Icon = getSpecialtyIcon(deptName);

                        return (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 [&_svg]:stroke-current [&_svg]:fill-none">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="font-medium text-gray-900">{deptName}</span>
                                </div>
                                <Badge variant="outline" className="text-xs text-primary border-primary bg-white">
                                    متاح 24
                                </Badge>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
