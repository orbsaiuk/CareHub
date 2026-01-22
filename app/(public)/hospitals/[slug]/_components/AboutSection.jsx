"use client";

import { Card, CardContent } from "@/components/ui/card";

export function AboutSection({ description }) {
    if (!description) return null;

    return (
        <Card className="border-1 shadow-md border-r-4 border-r-primary">
            <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">عن المستشفى</h2>
                <p className="text-gray-700 text-justify text-lg">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}
