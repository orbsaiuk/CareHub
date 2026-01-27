"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Settings, Check, ChevronDown, ChevronUp, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "cookie_consent";
const COOKIE_PREFERENCES_KEY = "cookie_preferences";

const defaultPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

export default function CookieConsent() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState(defaultPreferences);

  // Don't show cookie consent on studio pages
  if (pathname?.startsWith("/studio")) {
    return null;
  }
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    saveConsent(onlyNecessary);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const saveConsent = (prefs) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    localStorage.setItem("cookie_consent_date", new Date().toISOString());
    setPreferences(prefs);
    setIsVisible(false);
    window.dispatchEvent(new CustomEvent("cookieConsentUpdate", { detail: prefs }));
  };

  const togglePreference = (key) => {
    if (key === "necessary") return;
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const cookieCategories = [
    {
      key: "necessary",
      title: "ملفات تعريف الارتباط الضرورية",
      description: "ضرورية لتشغيل الموقع الأساسي - الأمان، تسجيل الدخول، والوظائف الأساسية.",
      required: true,
      icon: "🔒",
    },
    {
      key: "analytics",
      title: "ملفات تعريف الارتباط التحليلية",
      description: "تساعدنا على فهم كيفية استخدام الموقع وتحسين الأداء.",
      required: false,
      icon: "📊",
    },
    {
      key: "marketing",
      title: "ملفات تعريف الارتباط التسويقية",
      description: "لعرض إعلانات مخصصة وقياس فعالية الحملات الإعلانية.",
      required: false,
      icon: "📢",
    },
    {
      key: "functional",
      title: "ملفات تعريف الارتباط الوظيفية",
      description: "لحفظ تفضيلاتك مثل اللغة والعملة وإعدادات العرض.",
      required: false,
      icon: "⚙️",
    },
  ];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop with dark overlay */}
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] md:hidden"
              onClick={() => setIsMinimized(true)}
            />
          )}

          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed z-[9999] ${isMinimized
              ? "bottom-4 left-4 md:left-4 md:w-auto"
              : "bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto md:max-w-[460px]"
              }`}
          >
            {isMinimized ? (
              /* Minimized State - Floating Button */
              <motion.button
                onClick={() => setIsMinimized(false)}
                className="cursor-pointer flex items-center gap-3 bg-primary text-white p-3 rounded-full shadow-2xl shadow-black/30 hover:bg-[#00B8DB] transition-all duration-300 mx-auto md:mx-0 border border-white/10"
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                title="إعدادات ملفات تعريف الارتباط"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Cookie className="w-full" />
                </div>
              </motion.button>
            ) : (
              /* Full Premium Banner */
              <div className="bg-gradient-to-br from-[#1a1a1a] via-[#252525] to-[#1f1f1f] rounded-t-3xl md:rounded-2xl shadow-2xl shadow-black/50 overflow-hidden border border-white/10">
                {/* Decorative gradient glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#188BFF]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#00B8DB]/20 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="relative px-6 py-6 border-b border-white/10">
                  <div className="flex items-start gap-4">
                    {/* Cookie Icon with glow */}
                    <motion.div
                      className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#188BFF] to-[#00B8DB] rounded-2xl flex items-center justify-center shadow-lg shadow-[#188BFF]/30"
                      animate={{
                        boxShadow: [
                          "0 10px 40px -10px rgba(24, 139, 255, 0.3)",
                          "0 10px 40px -10px rgba(24, 139, 255, 0.5)",
                          "0 10px 40px -10px rgba(24, 139, 255, 0.3)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Cookie className="w-7 h-7 text-white" />
                    </motion.div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                        نُحسّن تجربتك
                        <span className="text-xl">🍪</span>
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتقديم محتوى مخصص يناسب اهتماماتك.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsMinimized(true)}
                      className="cursor-pointer flex-shrink-0 p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 group"
                      aria-label="تصغير"
                    >
                      <X className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Preferences Panel */}
                <AnimatePresence>
                  {showPreferences && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 bg-black/30 border-b border-white/5 max-h-[280px] overflow-y-auto custom-scrollbar">
                        <div className="space-y-3">
                          {cookieCategories.map((category, index) => (
                            <motion.div
                              key={category.key}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.08 }}
                              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-[#188BFF]/50 hover:bg-white/[0.07] transition-all duration-300 group"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 flex-1">
                                  <span className="text-2xl opacity-80 group-hover:opacity-100 transition-opacity">{category.icon}</span>
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="font-semibold text-white text-sm">
                                        {category.title}
                                      </h4>
                                      {category.required && (
                                        <span className="px-2 py-0.5 bg-[#188BFF]/20 text-[#A6D8FF] text-xs rounded-full font-medium border border-[#188BFF]/30">
                                          مطلوب
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                      {category.description}
                                    </p>
                                  </div>
                                </div>

                                {/* Custom Toggle Switch */}
                                <button
                                  onClick={() => togglePreference(category.key)}
                                  disabled={category.required}
                                  className={`relative flex-shrink-0 w-12 h-7 rounded-full transition-all duration-300 ${preferences[category.key]
                                    ? "bg-gradient-to-r from-[#188BFF] to-[#00B8DB]"
                                    : "bg-white/10"
                                    } ${category.required ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:ring-2 hover:ring-[#188BFF]/50"}`}
                                >
                                  <motion.div
                                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center"
                                    animate={{
                                      left: preferences[category.key] ? "4px" : "calc(100% - 24px)",
                                    }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                  >
                                    {preferences[category.key] && (
                                      <Check className="w-3 h-3 text-[#188BFF]" />
                                    )}
                                  </motion.div>
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="px-6 py-5 relative">
                  <div className="flex flex-col gap-3">
                    {/* Primary Actions */}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleAcceptAll}
                        className="cursor-pointer flex-1 bg-gradient-to-r from-[#188BFF] to-[#00B8DB] hover:from-[#3399FF] hover:to-[#00CCF0] text-white font-medium py-6 rounded-xl shadow-lg shadow-[#188BFF]/25 hover:shadow-xl hover:shadow-[#188BFF]/40 transition-all duration-300 border-0"
                      >
                        <Check className="w-4 h-4 ml-2" />
                        قبول الكل
                      </Button>
                      <Button
                        onClick={handleRejectAll}
                        variant="outline"
                        className="cursor-pointer flex-1 bg-transparent border-2 border-white/20 hover:border-white/40 text-white font-medium py-6 rounded-xl hover:bg-white/5 transition-all duration-300 hover:text-white"
                      >
                        الضروري فقط
                      </Button>
                    </div>

                    {/* Settings Toggle & Save Button */}
                    <div className="flex gap-3 items-center">
                      <button
                        onClick={() => setShowPreferences(!showPreferences)}
                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 text-gray-400 hover:text-white py-2.5 text-sm font-medium transition-all duration-300 hover:bg-white/5 rounded-lg"
                      >
                        <Settings className="w-4 h-4" />
                        <span>تخصيص الإعدادات</span>
                        {showPreferences ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </button>

                      <AnimatePresence>
                        {showPreferences && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: -10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Button
                              onClick={handleSavePreferences}
                              className="cursor-pointer bg-white/10 hover:bg-[#188BFF]/30 text-white border border-[#188BFF]/50 hover:border-[#188BFF] font-medium px-5 py-2.5 rounded-xl transition-all duration-300"
                            >
                              حفظ التفضيلات
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Footer Links */}
                  <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-white/10">
                    <Link
                      href="/privacy"
                      className="cursor-pointer flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#188BFF] transition-colors group"
                    >
                      <Shield className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      سياسة الخصوصية
                    </Link>
                    <span className="text-white/20">|</span>
                    <Link
                      href="/cookies"
                      className="cursor-pointer flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#188BFF] transition-colors group"
                    >
                      <Cookie className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      سياسة الكوكيز
                    </Link>
                    <span className="text-white/20">|</span>
                    <Link
                      href="/terms"
                      className="cursor-pointer flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#188BFF] transition-colors group"
                    >
                      <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      الشروط والأحكام
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}