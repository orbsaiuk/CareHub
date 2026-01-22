"use client";

import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export function PromotionalBanner({ image, ctaLink, title }) {
    if (!image?.asset) {
        return null;
    }

    const imageUrl = urlFor(image)
        .width(1700)
        .height(500)
        .quality(90)
        .url();

    const finalHref = ctaLink.startsWith("http") || ctaLink.startsWith("/") 
        ? ctaLink 
        : `https://${ctaLink}`;

    return (
        <Link
            href={finalHref}
            target="_blank"
            rel="noopener noreferrer"
            className="block my-8 w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
            <div className="relative w-full h-[200px] md:h-[300px] lg:h-[400px]">
                <Image
                    src={imageUrl}
                    alt={image.alt || title || "Promotional Banner"}
                    fill
                    className="object-contain hover:scale-105 transition-transform duration-300"
                    sizes="100vw"
                    priority={false}
                />
            </div>
        </Link>
    );
}
