import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";

export function SpecialtyCard({
  name,
  slug,
  icon,
  doctorCount,
  ...props
}) {
  return (
    <Link href={`/specialties/${slug}`}>
      <Card
        className="group bg-white rounded-2xl shadow-md cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300"
        {...props}
      >
        <CardContent className="flex flex-col items-center p-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-linear-bg">
            {icon && (
              <div className="relative w-14 h-14">
                <Image
                  src={icon}
                  alt={name}
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
            )}
          </div>

          <h3 className="font-bold text-neutral-950 text-xl text-center mb-2">
            {name}
          </h3>

          <p className="font-medium text-primary text-sm text-center bg-primary/5 px-3 py-1 rounded-full">
            {doctorCount} طبيب
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
