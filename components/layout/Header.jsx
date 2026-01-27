"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { CiPhone } from "react-icons/ci";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { UserButton } from "../auth/UserButton";
import { useAuth } from "@clerk/nextjs";

const navigationItems = [
  { label: "الرئيسية", href: "/" },
  { label: "التخصصات", href: "/specialties" },
  { label: "الأطباء", href: "/doctors" },
  { label: "المنشآت الطبية", href: "/facilities" },
];

export const Header = () => {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm border-b border-light-gray-200 sticky top-0 z-50 shadow-sm/50">
      <div className="container">
        <nav className="flex h-20 items-center justify-between" dir="rtl">
          {/* Logo area could be added here if needed, pushing nav to center or left */}

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navigationItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "font-medium text-lg transition-colors relative group py-2",
                    isActive ? "text-primary" : "text-gray-600 hover:text-primary"
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 rounded-full",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  ></span>
                </Link>
              );
            })}
          </div>

          {/* Buttons Area */}
          <div className="flex items-center gap-3 shrink-0">
            {isSignedIn && (
              <Link
                href="/messaging"
                className={cn(
                  "p-2 rounded-xl transition-all duration-300 relative group hover:bg-gray-100",
                  pathname === "/messaging" ? "text-primary bg-blue-50" : "text-gray-600"
                )}
                title="المحادثات"
              >
                <HiOutlineChatAlt2 className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-white animate-pulse"></span>
              </Link>
            )}

            <UserButton />

            <Button variant="ghost" className="h-10 rounded-xl gap-2 hover:bg-gray-100/80 text-neutral-950">
              <span className="font-medium text-sm">
                اتصل بنا
              </span>
              <CiPhone className="w-4 h-4" />
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};
