import Image from "next/image";
import Link from "next/link";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

export const Footer = () => {
  const contactInfo = [
    {
      icon: <FaPhone className="w-5 h-5 text-white" />,
      title: "920000000",
      subtitle: "السبت - الخميس (9 ص - 5 م)",
    },
    {
      icon: <FaEnvelope className="w-5 h-5 text-white" />,
      title: "info@healthcare.sa",
      subtitle: null,
    },
    {
      icon: <FaMapMarkerAlt className="w-5 h-5 text-white" />,
      title: "الرياض، المملكة العربية السعودية",
      subtitle: null,
    },
  ];

  const doctorsLinks = [
    "انضم كطبيب",
    "تسجيل عيادة",
    "لوحة التحكم",
    "الأسعار والباقات",
    "الشروط والأحكام",
    "سياسة الخصوصية",
  ];

  const quickLinks = [
    "الرئيسية",
    "التخصصات",
    "الأطباء",
    "المستشفيات",
    "من نحن",
    "الأسئلة الشائعة",
  ];

  const socialLinks = [
    { icon: <FaTwitter className="w-5 h-5" />, href: "#" },
    { icon: <FaLinkedin className="w-5 h-5" />, href: "#" },
    { icon: <FaInstagram className="w-5 h-5" />, href: "#" },
    { icon: <FaFacebook className="w-5 h-5" />, href: "#" },
  ];

  return (
    <footer className="relative w-full bg-transparent bg-[linear-gradient(135deg,rgba(16,24,40,1)_0%,rgba(49,44,133,1)_50%,rgba(43,127,255,1)_100%)]">

      <div className="container relative flex flex-col items-start gap-16 px-4 py-10  mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 w-full">
          <div className="flex flex-col items-start gap-6">
            <div className="w-full">
              <h3 className="font-bold text-white text-xl tracking-[0] leading-7 text-right">
                تواصل معنا
              </h3>
            </div>

            <div className="flex flex-col items-start gap-4 w-full">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-3 w-full">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex flex-col items-start flex-1">
                    <div className="w-full">
                      <p className="font-normal text-white text-base text-right tracking-[0] leading-6">
                        {item.title}
                      </p>
                    </div>
                    {item.subtitle && (
                      <div className="w-full">
                        <p className="font-normal text-white text-sm tracking-[0] leading-5">
                          {item.subtitle}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="w-full">
              <h3 className="font-bold text-white text-xl tracking-[0] leading-7 text-right">
                للأطباء والعيادات
              </h3>
            </div>

            <div className="flex flex-col items-start gap-3 w-full">
              {doctorsLinks.map((link, index) => (
                <Link
                  key={index}
                  href="#"
                  className="w-fit font-normal text-white text-base tracking-[0] leading-6 block text-right hover:text-white transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="w-full">
              <h3 className="font-bold text-white text-xl tracking-[0] leading-7 text-right">
                روابط سريعة
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href="#"
                  className="w-fit font-normal text-white text-base tracking-[0] leading-6 block text-right hover:text-white transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1">
                <h2 className="font-bold text-white text-2xl tracking-[0] leading-8 text-right">
                  منصة الرعاية الصحية
                </h2>
              </div>
            </div>

            <div className="w-full">
              <p className="text-white text-base font-normal tracking-[0] leading-6 text-right">
                منصتك الموثوقة للعثور على أفضل الأطباء والمستشفيات وحجز المواعيد
                الطبية بكل سهولة.
              </p>
            </div>

            <div className="flex items-center gap-4 w-full">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start pt-8 w-full border-t-[0.8px] border-white/10">
          <div className="w-full text-center">
             <p className="font-normal text-white text-sm">
              منصة الرعاية الصحية. جميع الحقوق محفوظة © {new Date().getFullYear()}.
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
