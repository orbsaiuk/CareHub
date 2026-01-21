export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: ["/", "/_next/image"],
        disallow: ["/api/", "/studio/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/_next/image"],
        disallow: ["/api/", "/studio/"],
      },
      {
        userAgent: "Googlebot-Video",
        allow: ["/", "/_next/image"],
        disallow: ["/api/", "/studio/"],
      },
      {
        userAgent: "*",
        allow: ["/", "/_next/image"],
        disallow: ["/api/", "/studio/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
