"use client";

import Image from "next/image";
import Link from "next/link";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { urlFor } from "@/sanity/lib/image";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

export function FacilityCard({
  slug,
  name,
  rating = 0,
  reviewsCount = 0,
  location,
  logo,
  className,
  ...props
}) {
  // Generate image URL from Sanity
  const imageUrl = logo ? urlFor(logo).width(600).height(400).url() : "/rectangle-1.svg";

  return (
    <Card
      className={cn(
        "overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow duration-300 bg-white flex flex-col h-full",
        className
      )}
      dir="rtl"
      {...props}
    >
      {/* Image Header */}
      <div className="relative w-full h-48 bg-gray-100">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <CardContent className="flex-1 p-5 space-y-3">
        <div>
          <h3 className="font-bold text-xl text-gray-900 leading-tight">{name}</h3>
        </div>
        {rating > 0 && (
          <div className="w-fit flex items-center gap-1 bg-yellow-50/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm font-bold text-gray-800">
            <FaStar className="text-yellow-400 w-3.5 h-3.5" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-gray-400 font-normal">({reviewsCount})</span>
          </div>
        )}
        {location && (
          <div className="flex items-start gap-2 text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100/50">
            <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <span className="leading-relaxed">{location}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-3">
        <Link href={`/facilities/${slug}`} className="flex-1">
          <Button className="w-full bg-blue-500 hover:bg-blue-600 shadow-blue-100 shadow-lg">
            عرض التفاصيل
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
