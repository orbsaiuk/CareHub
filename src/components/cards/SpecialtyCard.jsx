"use client";

import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";

export function SpecialtyCard({
  name,
  icon: Icon,
  doctorCount,
  className,
  ...props
}) {
  return (
    <Card
      className={cn(
        "group bg-white rounded-2xl shadow-md cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300",
        className
      )}
      {...props}
    >
      <CardContent className="flex flex-col items-center p-8">
        <div 
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-linear-bg text-white"
        >
          {Icon && <Icon className="w-10 h-10" />}
        </div>

        <h3 className="font-bold text-neutral-950 text-xl text-center mb-2">
          {name}
        </h3>

        <p className="font-medium text-primary text-sm text-center bg-primary/5 px-3 py-1 rounded-full">
          {doctorCount}
        </p>
      </CardContent>
    </Card>
  );
}
