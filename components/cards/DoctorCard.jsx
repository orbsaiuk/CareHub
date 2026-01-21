"use client";

import Image from "next/image";
import Link from "next/link";
import { FaStar, FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import { PiSuitcaseSimple } from "react-icons/pi";
import { LuFileText } from "react-icons/lu";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";

export function DoctorCard({
  slug,
  name = "د. أحمد محمود",
  specialty = "طب القلب",
  rating = 4.9,
  reviewsCount = 234,
  experienceYears = 15,
  hospitalName = "مستشفى الملك فيصل التخصصي - الرياض",
  location = "الرياض",
  price = 350,
  imageUrl = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=60",
  isAvailable = true,
  className,
  ...props
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-none shadow-md bg-white",
        className
      )}
      dir="rtl"
      {...props}
    >
      <CardContent className="p-5">
        <div className="flex gap-4">
          <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28">
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-bold text-lg text-foreground mb-1">{name}</h3>
              <p className="text-blue-500 font-medium flex items-center gap-1">
                {specialty}
              </p>
            </div>

            {/* Rating and Experience Row */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-sm border border-yellow-100">
                <span className="font-bold">{rating}</span>
                <FaStar className="text-yellow-400 w-3 h-3" />
                <span className="text-muted-foreground mr-1">({reviewsCount})</span>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground bg-gray-50 px-2 py-1 rounded-sm border">
                <PiSuitcaseSimple className="w-3 h-3" />
                <span>{experienceYears} سنة خبرة</span>
              </div>
            </div>

            {/* Location / Hospital */}
            <div className="flex items-start gap-1.5 text-sm text-muted-foreground bg-gray-50 p-2 rounded-md border border-gray-100">
              <FaMapMarkerAlt className="w-3 h-3 mt-0.5 text-gray-400 shrink-0" />
              <span className="leading-tight">{hospitalName}</span>
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="mt-4 flex items-center justify-center gap-1 border-t border-dashed pt-3 px-2">
          <span className="text-muted-foreground">سعر الكشف:</span>
          <span className="font-bold text-blue-600 text-lg">{price} ريال</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-3 grid grid-cols-2">
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm shadow-blue-100 shadow-lg">
          <FaRegCalendarAlt className="w-4 h-4" />
          احجز موعد
        </Button>
        <Link href={`/doctors/${slug}`} className="w-full">
          <Button variant="outline" className="w-full text-sm font-normal border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50">
            <LuFileText className="w-4 h-4" />
            عرض الملف
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
