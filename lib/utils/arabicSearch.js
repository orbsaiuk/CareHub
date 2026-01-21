/**
 * Normalizes Arabic text by removing diacritics and standardizing characters
 */
export function normalizeArabic(text) {
  if (!text) return "";
  let normalized = text;

  // Remove diacritics (Tashkeel)
  normalized = normalized.replace(/[\u064B-\u065F]/g, "");

  // Normalize Alef
  normalized = normalized.replace(/[أإآ]/g, "ا");

  // Normalize Taa Marbuta to Ha
  normalized = normalized.replace(/ة/g, "ه");

  // Normalize Yaa
  normalized = normalized.replace(/ى/g, "ي");

  return normalized;
}

/**
 * Removes 'Al-' (ال) prefix from words in the text
 */
export function removeAlPrefix(text) {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => {
      // Only remove if word is long enough to be a valid word after removal
      // e.g. "ال" (God) shouldn't be empty, "الم" etc.
      if (word.startsWith("ال") && word.length > 3) {
        return word.slice(2);
      }
      return word;
    })
    .join(" ");
}

/**
 * Prepares a search query by normalizing and removing prefixes
 */
export function normalizeArabicQuery(query) {
  if (!query) return "";
  let normalized = normalizeArabic(query);
  normalized = removeAlPrefix(normalized);
  return normalized;
}

/**
 * Client-side filtering helper (placeholder/implementation)
 */
export function filterByArabicSearch(
  items,
  query,
  fields = ["title", "description"]
) {
  if (!query || !items) return items || [];

  const normalizedQuery = normalizeArabicQuery(query).toLowerCase();
  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);

  if (queryWords.length === 0) return items;

  return items.filter((item) => {
    return fields.some((field) => {
      const value = item[field];
      if (!value) return false;

      const normalizedValue = normalizeArabic(value).toLowerCase();

      // Check if ALL query words are present in the value (AND logic)
      // This is a simple inclusion check.
      // Since we stripped 'Al' from query, we should check if the value contains the word
      // The value might still have 'Al'.
      // e.g. Query "سكري" (from "السكري"), Value "السكري".
      // "السكري" contains "سكري".

      return queryWords.every((word) => normalizedValue.includes(word));
    });
  });
}
