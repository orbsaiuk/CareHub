// Google Analytics 4 implementation
// Add your GA4 measurement ID to .env.local:
// NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Track page views
export const pageview = (url) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({ action, category, label, value }) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track search queries
export const trackSearch = (searchTerm, category = null) => {
  event({
    action: "search",
    category: "engagement",
    label: searchTerm,
    value: category,
  });
};

// Track company views
export const trackCompanyView = (companyName, companyId) => {
  event({
    action: "view_company",
    category: "engagement",
    label: companyName,
    value: companyId,
  });
};

// Track contact button clicks
export const trackContactClick = (companyName) => {
  event({
    action: "contact_click",
    category: "conversion",
    label: companyName,
  });
};

// Track offer views
export const trackOfferView = (offerTitle) => {
  event({
    action: "view_offer",
    category: "engagement",
    label: offerTitle,
  });
};
