import { sanityFetch } from "@/sanity/lib/client";
import { STATIC_HOME_CONTENT_QUERY } from "@/sanity/queries/staticHomeContent";
import { STATIC_ONBOARDING_CONTENT_QUERY } from "@/sanity/queries/staticOnboardingContent";
import { STATIC_BECOME_CONTENT_QUERY } from "@/sanity/queries/staticBecomeContent";
import { STATIC_NEWSLETTER_CONTENT_QUERY } from "@/sanity/queries/staticNewsletterContent";
import { STATIC_OFFERS_CONTENT_QUERY } from "@/sanity/queries/staticOffersContent";
import { STATIC_TENANT_LIST_CONTENT_QUERY } from "@/sanity/queries/staticTenantListContent";
import { STATIC_ABOUT_CONTENT_QUERY } from "@/sanity/queries/staticAboutContent";
import { STATIC_TERMS_CONTENT_QUERY } from "@/sanity/queries/staticTermsContent";
import { STATIC_PRIVACY_CONTENT_QUERY } from "@/sanity/queries/staticPrivacyContent";
import { STATIC_COOKIES_CONTENT_QUERY } from "@/sanity/queries/staticCookiesContent";
import { STATIC_MEDIA_CONTENT_QUERY } from "@/sanity/queries/staticMediaContent";
import { STATIC_PRODUCTS_CONTENT_QUERY } from "@/sanity/queries/staticProductsContent";
import { STATIC_FOOTER_CONTENT_QUERY } from "@/sanity/queries/staticFooterContent";

export async function getStaticHomeContent() {
  try {
    return await sanityFetch(STATIC_HOME_CONTENT_QUERY);
  } catch (error) {
    console.error("Error fetching static home content:", error);
    return null;
  }
}

export async function getStaticOnboardingContent() {
  try {
    return await sanityFetch(STATIC_ONBOARDING_CONTENT_QUERY);
  } catch (error) {
    console.error("Error fetching static onboarding content:", error);
    return null;
  }
}

export async function getStaticBecomeContent() {
  try {
    return await sanityFetch(STATIC_BECOME_CONTENT_QUERY);
  } catch (error) {
    console.error("Error fetching static become content:", error);
    return null;
  }
}

export async function getStaticNewsletterContent() {
  try {
    return await sanityFetch(STATIC_NEWSLETTER_CONTENT_QUERY);
  } catch (error) {
    console.error("Error fetching static newsletter content:", error);
    return null;
  }
}

export async function getStaticOffersContent() {
  try {
    return await sanityFetch(STATIC_OFFERS_CONTENT_QUERY);
  } catch (error) {
    console.error("Error fetching static offers content:", error);
    return null;
  }
}

export async function getStaticTenantListContent() {
  try {
    return await sanityFetch(STATIC_TENANT_LIST_CONTENT_QUERY);
  } catch (error) {
    console.error("Error fetching static tenant list content:", error);
    return null;
  }
}

export async function getStaticAboutContent() {
  try {
    return await sanityFetch(STATIC_ABOUT_CONTENT_QUERY);
  } catch (error) {
    console.error("Error fetching static about content:", error);
    return null;
  }
}

export async function getStaticTermsContent() {
  try {
    return await sanityFetch(STATIC_TERMS_CONTENT_QUERY);
  } catch (error) {
    console.error("Error fetching static terms content:", error);
    return null;
  }
}

export async function getStaticPrivacyContent() {
  try {
    return await sanityFetch(STATIC_PRIVACY_CONTENT_QUERY);
  } catch (error) {
    console.error("Error fetching static privacy content:", error);
    return null;
  }
}

export async function getStaticCookiesContent() {
  try {
    return await sanityFetch(STATIC_COOKIES_CONTENT_QUERY);
  } catch (error) {
    console.error("Error fetching static cookies content:", error);
    return null;
  }
}

export async function getStaticMediaContent() {
  try {
    return await sanityFetch(STATIC_MEDIA_CONTENT_QUERY);
  } catch (error) {
    console.error("Error fetching static media content:", error);
    return null;
  }
}

export async function getStaticProductsContent() {
  try {
    return await sanityFetch(STATIC_PRODUCTS_CONTENT_QUERY);
  } catch (error) {
    console.error("Error fetching static products content:", error);
    return null;
  }
}

export async function getStaticFooterContent() {
  try {
    return await sanityFetch(STATIC_FOOTER_CONTENT_QUERY);
  } catch (error) {
    console.error("Error fetching static footer content:", error);
    return null;
  }
}

export async function getAllStaticContent() {
  try {
    const [home, onboarding, become, newsletter, offers, tenants] =
      await Promise.all([
        getStaticHomeContent(),
        getStaticOnboardingContent(),
        getStaticBecomeContent(),
        getStaticNewsletterContent(),
        getStaticOffersContent(),
        getStaticTenantListContent(),
      ]);

    return {
      home,
      onboarding,
      become,
      newsletter,
      offers,
      tenants,
    };
  } catch (error) {
    console.error("Error fetching all static content:", error);
    return {
      home: null,
      footer: null,
      onboarding: null,
      become: null,
      newsletter: null,
      offers: null,
      tenants: null,
    };
  }
}
