import Image from "next/image";
import { FaStar, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";
import { PiSuitcaseSimple } from "react-icons/pi";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function DoctorHero({ doctor }) {
    return (
        <Card className="shadow-md overflow-hidden border-r-4 border-r-primary">
            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Doctor Image */}
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden flex-shrink-0 ml-auto shadow-md">
                        <Image
                            src={doctor.image}
                            alt={doctor.name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Doctor Details */}
                    <div className="flex-1 text-right">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            {doctor.name}
                        </h1>

                        <p className="text-lg text-primary font-semibold mb-3">
                            {doctor.specialty}
                        </p>


                        {/* Rating and Experience Row */}
                        <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
                            <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-sm border border-yellow-100">
                                <span className="font-bold">{doctor.rating}</span>
                                <FaStar className="text-yellow-400 w-3 h-3" />
                                <span className="text-muted-foreground mr-1">({doctor.reviewsCount})</span>
                            </div>

                            <div className="flex items-center gap-1 text-muted-foreground bg-gray-50 px-2 py-1 rounded-sm border">
                                <PiSuitcaseSimple className="w-3 h-3" />
                                <span>{doctor.experienceYears} سنة خبرة</span>
                            </div>
                        </div>

                        {/* Location / Hospital */}
                        {doctor.hospitals && doctor.hospitals.length > 0 && (
                            <div className="w-fit flex items-start gap-1.5 text-sm text-blue-500 bg-blue-50 p-2 rounded-md mb-4">
                                <FaMapMarkerAlt className="w-3 h-3 mt-0.5 text-blue-500 shrink-0" />
                                <span className="leading-tight">
                                    {doctor.hospitals[0].hospital.name} - {doctor.hospitals[0].hospital.address.city}
                                </span>
                            </div>
                        )}

                        {/* Social Links */}
                        <div className="flex gap-5">
                            <Link title="فيسبوك" href="#" className="text-blue-400 hover:text-blue-600 transition-colors">
                                <FaFacebook size={20} />
                            </Link>
                            <Link title="تويتر" href="#" className="text-blue-400 hover:text-blue-400 transition-colors">
                                <FaTwitter size={20} />
                            </Link>
                            <Link title="انستغرام" href="#" className="text-blue-400 hover:text-pink-600 transition-colors">
                                <FaInstagram size={20} />
                            </Link>
                            <Link title="لينكد إن" href="#" className="text-blue-400 hover:text-blue-700 transition-colors">
                                <FaLinkedin size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
