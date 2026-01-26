"use client";

import { Button } from "@/components/ui/button";
import { FacilitiesGrid } from "./FacilitiesGrid";
import Link from "next/link";

export function FacilitiesSection({ title, facilities, link }) {
    if (!facilities || facilities.length === 0) return null;

    return (
        <div>
            {/* Section Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    </div>
                </div>
                {link && (
                    <Link href={link}>
                        <Button variant="link" className="text-primary hover:text-primary/80 font-bold">
                            عرض الكل
                        </Button>
                    </Link>
                )}
            </div>

            {/* Grid */}
            <FacilitiesGrid facilities={facilities} />
        </div>
    );
}
