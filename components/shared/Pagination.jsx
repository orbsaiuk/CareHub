"use client";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export function Pagination({
  currentPage = 1,
  totalPages = 3,
  onPageChange,
  className
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={cn("flex justify-center items-center gap-2 mt-10", className)} dir="rtl">
      <Button
        variant="outline"
        className={cn(
          "px-4 py-2 h-10 rounded-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700",
          currentPage === 1 && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => {
          if (currentPage > 1) {
            onPageChange?.(currentPage - 1);
          }
        }}
      >
        السابق
      </Button>

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            className={cn(
              "w-10 h-10 rounded-full p-0 font-bold text-sm",
              currentPage === page
                ? "bg-blue-500 hover:bg-blue-600 text-white border-none shadow-md shadow-blue-200"
                : "border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-white"
            )}
            onClick={() => onPageChange?.(page)}
          >
            {page}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        className={cn(
          "px-4 py-2 h-10 rounded-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700",
          currentPage === totalPages && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => {
          if (currentPage < totalPages) {
            onPageChange?.(currentPage + 1);
          }
        }}
      >
        التالي
      </Button>
    </div>
  );
}
