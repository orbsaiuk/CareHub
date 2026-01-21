/**
 * Utility functions for handling blog content conversion between HTML and plain text
 */


export function cleanText(text) {
  if (!text || typeof text !== "string") return "";

  return (
    text
      // Remove zero-width characters
      .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "")
      // Remove HTML entities for zero-width spaces
      .replace(/&#(?:x)?(?:200[BCD]|FEFF|AD|8203|8204|8205);?/gi, "")
      .replace(/&ZeroWidthSpace;/gi, "")
      .replace(/&zwj;/gi, "")
      .replace(/&zwnj;/gi, "")
      // Remove other common invisible characters
      .replace(/[\u2060\u180E]/g, "")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}


export function htmlToPlainText(html) {
  if (!html || typeof html !== "string") return "";

  // Remove HTML tags and decode entities
  return cleanText(
    html
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/&nbsp;/g, " ") // Replace non-breaking spaces
      .replace(/&amp;/g, "&") // Decode ampersands
      .replace(/&lt;/g, "<") // Decode less than
      .replace(/&gt;/g, ">") // Decode greater than
      .replace(/&quot;/g, '"') // Decode quotes
      .replace(/&#39;/g, "'") // Decode apostrophes
  );
}

export function sanitizeHtml(html) {
  if (!html || typeof html !== "string") return "";

  // Basic sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
}

export function extractExcerpt(html, maxLength = 200) {
  const plainText = htmlToPlainText(html);
  if (plainText.length <= maxLength) return plainText;

  // Find the last complete word within the limit
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + "..."
    : truncated + "...";
}

/**
 * Clean HTML content from hidden characters while preserving HTML structure
 * @param {string} html - HTML content
 * @returns {string} Cleaned HTML
 */
export function cleanHtmlContent(html) {
  if (!html || typeof html !== "string") return "";

  return (
    html
      // Remove zero-width characters
      .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "")
      // Remove HTML entities for zero-width spaces
      .replace(/&#(?:x)?(?:200[BCD]|FEFF|AD|8203|8204|8205);?/gi, "")
      .replace(/&ZeroWidthSpace;/gi, "")
      .replace(/&zwj;/gi, "")
      .replace(/&zwnj;/gi, "")
      // Remove other common invisible characters
      .replace(/[\u2060\u180E]/g, "")
  );
}

export function formatContentForDisplay(html) {
  if (!html || typeof html !== "string") return "";

  // First clean hidden characters, then sanitize and style
  const cleanedHtml = cleanHtmlContent(sanitizeHtml(html));

  return cleanedHtml
    // Add styling classes to elements
    .replace(/<h1>/g, '<h1 class="text-3xl font-bold mb-4 text-gray-900">')
    .replace(/<h2>/g, '<h2 class="text-2xl font-semibold mb-3 text-gray-900">')
    .replace(/<h3>/g, '<h3 class="text-xl font-medium mb-2 text-gray-900">')
    .replace(/<p>/g, '<p class="mb-4 text-gray-800 leading-relaxed">')
    .replace(
      /<ul>/g,
      '<ul class="list-disc list-inside mb-4 space-y-2 text-gray-800">'
    )
    .replace(
      /<ol>/g,
      '<ol class="list-decimal list-inside mb-4 space-y-2 text-gray-800">'
    )
    .replace(/<li>/g, '<li class="leading-relaxed">')
    .replace(
      /<blockquote>/g,
      '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-gray-700 bg-blue-50">'
    )
    .replace(/<strong>/g, '<strong class="font-semibold">')
    .replace(/<em>/g, '<em class="italic">')
    .replace(/<a /g, '<a class="text-blue-600 hover:text-blue-800 underline" ')
    .replace(/<img /g, '<img class="max-w-full h-auto shadow-md my-4" ');
}


export function estimateReadingTime(html, wordsPerMinute = 200) {
  const plainText = htmlToPlainText(html);
  const wordCount = plainText
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
