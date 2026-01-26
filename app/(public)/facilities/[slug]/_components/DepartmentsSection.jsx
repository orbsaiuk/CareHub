"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

export function DepartmentsSection({ departments = [] }) {
    if (!departments || departments.length === 0) return null;

    return (
        <Card className="border-1 border-r-4 border-r-primary">
            <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">الأقسام الطبية</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {departments.map((dept, index) => {
                        const deptName = dept?.name || dept;
                        const deptIcon = dept?.icon;

                        return (
                            <div
                                key={dept?._id || index}
                                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
                            >
                                <div className="flex items-center gap-3">
                                    {deptIcon && (
                                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                                            <Image
                                                src={urlFor(deptIcon).url()}
                                                alt={deptName}
                                                width={24}
                                                height={24}
                                                className="w-full h-full object-contain brightness-0 invert"
                                            />
                                        </div>
                                    )}
                                    <span className="font-medium text-gray-900">{deptName}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
