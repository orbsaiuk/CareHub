"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function GallerySection({ images = [] }) {
    const defaultImages = [
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=60",
    ];

    const displayImages = images.length > 0 ? images : defaultImages;

    return (
        <Card className="border-1 border-r-4 border-r-primary">
            <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">معرض الصور</h2>

                <div className="grid grid-cols-3 gap-3">
                    {displayImages.slice(0, 3).map((image, index) => (
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
