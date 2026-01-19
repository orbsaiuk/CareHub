import { Tajawal } from "next/font/google";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { BackToTopButton } from "../components/layout/BackToTopButton";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["latin", "arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

export const metadata = {
  title: "CareHub - رعاية صحية متميزة",
  description:
    "نجمع لك أفضل الأطباء والمستشفيات والعيادات في مكان واحد. ابحث واحجز موعدك بكل سهولة وأمان.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`min-h-screen bg-background font-sans antialiased ${tajawal.variable}`}
      >
        <Header />
        {children}
        <Footer />
        <BackToTopButton />
      </body>
    </html>
  );
}
