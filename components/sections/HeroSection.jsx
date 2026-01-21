import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { FaSearch, FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";

const quickSearchTags = [
  { label: "طبيب أسنان", active: true },
  { label: "طبيب عيون", active: false },
  { label: "طبيب أطفال", active: false },
  { label: "طبيب باطنة", active: false },
];

export const HeroSection = () => {
  return (
    <section className="relative w-full bg-primary/10 min-h-screen flex flex-col py-10">

      <main className="flex-1 flex flex-col items-center justify-center px-4 container mx-auto relative">
        <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto z-10">
          <div className="flex flex-col items-center gap-2 w-full text-center">
            <h1 className="font-bold text-neutral-950 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
              رعاية صحية متميزة
            </h1>

            <h2 className="font-bold text-primary text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
              في متناول يدك
            </h2>
          </div>

          <p className="font-normal text-gray-500 text-xl sm:text-2xl text-center leading-relaxed max-w-2xl mx-auto mt-4">
            نجمع لك أفضل الأطباء والمستشفيات والعيادات في مكان واحد. ابحث واحجز
            موعدك بكل سهولة وأمان.
          </p>
        </div>

        <div className="w-full max-w-5xl mt-12 mb-20 relative z-10">
          <Card className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-xl border-white/50 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              {/* Search Bar */}
              <div className="flex flex-col lg:flex-row items-stretch gap-4 mb-8">
                 <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 bg-gray-50/80 rounded-2xl p-2 border border-gray-100">
                    <div className="flex-1 flex items-center gap-3 h-12 px-4 w-full">
                      <FaSearch className="w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="ابحث عن تخصص أو طبيب..."
                        className="border-0 bg-transparent p-0 h-full text-lg placeholder:text-gray-400 focus-visible:ring-0"
                      />
                    </div>
                    
                    <div className="w-px h-8 bg-gray-200 hidden sm:block" />
                    <div className="h-px w-full bg-gray-200 sm:hidden" />

                    <div className="flex items-center gap-3 h-12 px-4 w-full sm:w-auto min-w-[200px] cursor-pointer hover:bg-gray-100 rounded-xl transition-colors">
                      <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                      <span className="flex-1 text-gray-500 text-lg text-right">
                        الرياض
                      </span>
                      <FaChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                 </div>

                <Button className="h-14 lg:h-auto px-10 bg-primary hover:bg-primary/90 rounded-2xl shadow-lg shadow-blue-500/20 transition-all font-medium text-xl text-white [font-family:'Tajawal',Helvetica]">
                  بحث
                </Button>
              </div>

              {/* Quick Search Tags */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <span className="text-gray-500 text-lg">
                  بحث سريع:
                </span>
                <div className="flex flex-wrap justify-center gap-3">
                  {quickSearchTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className={`h-9 px-4 rounded-full cursor-pointer transition-all duration-300 border border-transparent ${
                        tag.active
                          ? "bg-primary text-white shadow-md shadow-blue-500/20 hover:bg-primary/90"
                          : "bg-blue-50 text-primary hover:bg-blue-100 hover:border-blue-200"
                      }`}
                    >
                      <span className="font-medium text-base">
                        {tag.label}
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </section>
  );
};
