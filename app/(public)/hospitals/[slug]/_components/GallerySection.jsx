"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function GallerySection({ images = [] }) {
    if (!images || images.length === 0) return null;

    return (
        <Card className="border-1 border-r-4 border-r-primary">
            <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">معرض الصور</h2>

                <div className="grid grid-cols-3 gap-3">
                    {images.slice(0, 6).map((image, index) => (
                        <div
                            key={index}
                            className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                        >
                            <Image
                                src={image}
                                alt={`صورة ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
