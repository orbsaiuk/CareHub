import {
  formatArabicNumber,
  translateCurrencyToArabic,
} from "@/lib/utils/arabic";

export function calculateDiscountedPrice(originalPrice, offerType, offerValue) {
  if (!originalPrice || !offerType || !offerValue) return originalPrice;

  // Ensure offerValue is always positive
  const absOfferValue = Math.abs(Number(offerValue) || 0);

  if (offerType === "percentage") {
    const discount = (originalPrice * absOfferValue) / 100;
    return originalPrice - discount;
  }

  if (offerType === "fixed") {
    return Math.max(0, originalPrice - absOfferValue);
  }

  return originalPrice;
}

export function calculateSavings(originalPrice, discountedPrice) {
  return originalPrice - discountedPrice;
}

export function calculateDiscountPercentage(originalPrice, discountedPrice) {
  if (!originalPrice || originalPrice === 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

export function isOfferValid(startDate, endDate) {
  // Since we removed date functionality, all offers are considered active
  // based on their status field only
  return "active";
}

export function getOfferStatus(offer) {
  // Since we removed date functionality, return the status field directly
  return offer.status || "active";
}

export function formatDiscountBadge(
  offerType,
  offerValue,
  currency = "SAR",
  includeLabel = true
) {
  // Ensure offerValue is always positive
  const value = Math.abs(Number(offerValue) || 0);

  if (value === 0) return "";

  const currencySymbol = translateCurrencyToArabic(currency);

  if (offerType === "percentage") {
    return includeLabel
      ? `خصم ${formatArabicNumber(value)}%`
      : `${formatArabicNumber(value)}%`;
  }

  if (offerType === "fixed") {
    return includeLabel
      ? `وفر ${formatArabicNumber(value)} ${currencySymbol}`
      : `${formatArabicNumber(value)} ${currencySymbol}`;
  }

  return "";
}
