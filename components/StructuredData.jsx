// مخطط الموقع الإلكتروني للموقع الرئيسي
export function generateWebsiteSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "تمور Hub",
    alternateName: "تمور Hub",
    description:
      "اكتشف وتواصل مع الشركات والموردين المعتمدين في الوطن العربي",
    url: siteUrl,
    inLanguage: ["ar", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/companies?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "تمور Hub",
      url: siteUrl,
    },
  };
}

// مخطط المنظمة الرئيسية لشعار الموقع في بحث جوجل
export function generateMainOrganizationSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "تمور Hub",
    alternateName: "تمور Hub",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/Logo.gif`,
      contentUrl: `${siteUrl}/Logo.gif`,
    },
    image: {
      "@type": "ImageObject",
      url: `${siteUrl}/og-image.jpg`,
      contentUrl: `${siteUrl}/og-image.jpg`,
    },
    description:
      "اكتشف وتواصل مع الشركات والموردين المعتمدين في الوطن العربي. استكشف فئات الأعمال والعروض الحصرية وملفات الشركات التفصيلية.",
    slogan: "اكتشف الشركات والموردين المعتمدين في الوطن العربي",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kantsir 97",
      addressLocality: "Berlin",
      postalCode: "10627",
      addressCountry: "DE",
    },
  };

  // أضف روابط وسائل التواصل الاجتماعي الحقيقية عند توفرها:
  // schema.sameAs = [
  //   "https://www.facebook.com/dateshub",
  //   "https://twitter.com/dateshub",
  //   "https://www.instagram.com/dateshub",
  //   "https://www.tiktok.com/@dateshub",
  // ];

  // أضف معلومات الاتصال الحقيقية عند توفرها:
  // schema.contactPoint = [
  //   {
  //     "@type": "ContactPoint",
  //     contactType: "خدمة العملاء",
  //     telephone: "+49-123-456-7890", // استبدل برقم حقيقي
  //     email: "info@dateshub.co",
  //     availableLanguage: ["العربية", "الإنجليزية"],
  //     areaServed: "الوطن العربي",
  //   },
  //   {
  //     "@type": "ContactPoint",
  //     contactType: "المبيعات",
  //     email: "sales@dateshub.co", // أضف إيميل المبيعات
  //     availableLanguage: ["العربية", "الإنجليزية"],
  //     areaServed: "الوطن العربي",
  //   },
  // ];

  return schema;
}

// مخطط المنظمة لصفحات الشركات
export function generateOrganizationSchema(company, siteUrl) {
  if (!company) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": company.locations?.length > 0 ? "LocalBusiness" : "Organization",
    name: company.name,
    url: `${siteUrl}/companies/${company.slug || company.id}`,
    description: company.description || undefined,
    telephone: company.contact?.phone || undefined,
    email: company.contact?.email || undefined,
    foundingDate: company.foundingYear
      ? `${company.foundingYear}-01-01`
      : undefined,
    numberOfEmployees: company.totalEmployees || undefined,
    sameAs:
      typeof company.socialLinks === "object" &&
        !Array.isArray(company.socialLinks)
        ? Object.values(company.socialLinks).filter(Boolean)
        : undefined,
  };

  // أضف الشعار إذا كان متوفراً
  if (company.logo?.asset?.url) {
    schema.logo = {
      "@type": "ImageObject",
      url: company.logo.asset.url,
      width: company.logo.asset.metadata?.dimensions?.width || undefined,
      height: company.logo.asset.metadata?.dimensions?.height || undefined,
    };
    schema.image = schema.logo;
  }

  // أضف العنوان للأعمال المحلية
  if (company.locations?.length > 0 && schema["@type"] === "LocalBusiness") {
    const location = company.locations[0];
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: location.address || undefined,
      addressLocality: location.city || undefined,
      addressRegion: location.region || undefined,
      addressCountry: location.country || undefined,
      postalCode: location.postalCode || undefined,
    };

    // أضف الإحداثيات الجغرافية إذا كانت متوفرة
    if (location.geo?.lat && location.geo?.lng) {
      schema.geo = {
        "@type": "GeoCoordinates",
        latitude: location.geo.lat,
        longitude: location.geo.lng,
      };
    }

    // أضف ساعات العمل إذا كانت متوفرة
    if (company.openingHours?.length > 0) {
      schema.openingHours = company.openingHours.map(
        (hours) => `${hours.day} ${hours.open}-${hours.close}`
      );
    }
  }

  // أضف التقييم الإجمالي إذا كان متوفراً
  if (company.rating > 0 && company.ratingCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: company.rating,
      reviewCount: company.ratingCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // أضف الخدمات/الفئات
  if (company.categories?.length > 0) {
    schema.knowsAbout = company.categories.map((cat) => cat.name || cat);
  }

  return schema;
}

// مولد مخطط الأسئلة الشائعة
export function generateFAQSchema(faqItems) {
  if (!faqItems?.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q || item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a || item.answer,
      },
    })),
  };
}

// مخطط المنتج/الخدمة للعروض
export function generateOfferSchema(offer, siteUrl) {
  if (!offer) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: offer.title,
    description: offer.description,
    url: `${siteUrl}/companies/${offer.company?.slug}`,
    seller: {
      "@type": "Organization",
      name: offer.company?.name,
    },
    validFrom: offer.startDate,
    validThrough: offer.endDate,
    availability: "https://schema.org/InStock",
  };
}

// مخطط صفحة "عنا" لتحسين ظهور البحث
export function generateAboutPageSchema(siteUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "عن تمور Hub",
    description:
      "تمور هب هي منصة غير تجارية تجمع بين الأفراد والشركات والموردين المعتمدين في الوطن العربي",
    url: `${siteUrl}/about`,
    mainEntity: {
      "@type": "Organization",
      name: "تمور Hub",
      description:
        "منصة أعمال تربط الشركات والموردين المعتمدين في الوطن العربي",
    },
  };
}

// مخطط صفحة الاتصال لتحسين ظهور البحث
export function generateContactPageSchema(siteUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "تواصل معنا",
    description: "تواصل مع فريق تمور Hub",
    url: `${siteUrl}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "تمور Hub",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "خدمة العملاء",
        telephone: "+49-...",
        email: "info@dateshub.co",
        availableLanguage: ["العربية", "الإنجليزية"],
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Kantsir 97",
        addressLocality: "Berlin",
        postalCode: "10627",
        addressCountry: "DE",
      },
    },
  };
}

// مخطط المقال لمنشورات المدونة
export function generateArticleSchema(blog, siteUrl) {
  if (!blog) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt || blog.description,
    url: `${siteUrl}/blogs/${blog.slug?.current || blog.id}`,
    datePublished: blog.publishedAt || blog._createdAt,
    dateModified: blog._updatedAt || blog.publishedAt || blog._createdAt,
    author: {
      "@type": "Person",
      name: blog.author?.name || "فريق تمور Hub",
    },
    publisher: {
      "@type": "Organization",
      name: "تمور Hub",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/Logo.gif`,
      },
    },
    image: blog.mainImage?.asset?.url
      ? {
        "@type": "ImageObject",
        url: blog.mainImage.asset.url,
        width: blog.mainImage.asset.metadata?.dimensions?.width || 800,
        height: blog.mainImage.asset.metadata?.dimensions?.height || 600,
      }
      : undefined,
    articleSection: blog.category?.title || "مقالات عامة",
    keywords: blog.tags?.map(tag => tag.title || tag).join(", ") || undefined,
    wordCount: blog.estimatedReadingTime ? blog.estimatedReadingTime * 200 : undefined,
    inLanguage: "ar",
  };
}

// مخطط صفحة المجموعة لصفحات العروض والمنتجات
export function generateCollectionPageSchema(siteUrl, pageType = "offers") {
  const schemas = {
    offers: {
      name: "العروض والخصومات",
      description: "اكتشف أحدث العروض والخصومات من الشركات والموردين المعتمدين",
      url: `${siteUrl}/offers`,
    },
    products: {
      name: "المنتجات",
      description: "تصفح مجموعة واسعة من المنتجات عالية الجودة",
      url: `${siteUrl}/products`,
    },
    blogs: {
      name: "المدونة",
      description: "اقرأ أحدث المقالات والأخبار في عالم الأعمال",
      url: `${siteUrl}/blogs`,
    },
  };

  const config = schemas[pageType] || schemas.offers;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: config.name,
    description: config.description,
    url: config.url,
    mainEntity: {
      "@type": "Organization",
      name: "تمور Hub",
      url: siteUrl,
    },
    inLanguage: "ar",
  };
}

// مخطط عناصر التنقل للمساعدة في ظهور روابط أقسام الموقع (SiteLinks)
export function generateSiteNavigationSchema(siteUrl) {
  const mainNav = [
    { name: "المنتجات", url: `${siteUrl}/products` },
    { name: "الشركات", url: `${siteUrl}/companies` },
    { name: "العروض", url: `${siteUrl}/offers` },
    { name: "الأخبار", url: `${siteUrl}/newsletter` },
    { name: "من نحن", url: `${siteUrl}/about` },
    { name: "تواصل معنا", url: `${siteUrl}/contact` },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: mainNav.map((item, index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: item.name,
      description: `تصفح قسم ${item.name} في تمور Hub`,
      url: item.url,
    })),
  };
}