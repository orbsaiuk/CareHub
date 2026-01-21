import { client as readClient } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/serverClient";
import {
  PUBLISHED_NEWS_ITEMS_QUERY,
  PUBLISHED_NEWSLETTER_ACTIVITIES_QUERY,
  RECENT_NEWS_ITEMS_QUERY,
  NEWS_BY_SLUG_QUERY,
  ACTIVITY_BY_SLUG_QUERY,
} from "@/sanity/queries/newsletter";
import {
  TOP_NEWS_BANNERS_FOR_EXPIRATION_QUERY,
  ACTIVE_TOP_NEWS_BANNERS_QUERY,
} from "@/sanity/queries/topNewsBanner";
import {
  sendNewsletterWelcomeEmail,
  sendNewsletterSubscriptionNotificationToAdmins,
  sendNewsletterUnsubscribeEmail,
} from "@/services/email/newsletterNotifications";

// Get all published news items (for news list page)
export async function getAllPublishedNewsItems() {
  try {
    const newsItems = await readClient.fetch(PUBLISHED_NEWS_ITEMS_QUERY);
    console.log("Fetched all news items:", newsItems?.length || 0);
    return newsItems || [];
  } catch (error) {
    console.error("Error fetching all news items:", error);
    return [];
  }
}

// Legacy function - kept for backward compatibility
export async function getPublishedNewsItems() {
  return getAllPublishedNewsItems();
}

// Get recent news items with limit (for homepage/newsletter page)
export async function getRecentNewsItems(limit = 5) {
  try {
    const newsItems = await readClient.fetch(RECENT_NEWS_ITEMS_QUERY, {
      limit,
    });
    return newsItems || [];
  } catch (error) {
    console.error("Error fetching recent news items:", error);
    return [];
  }
}

// Get single news item by slug (for detail page)
export async function getNewsBySlug(slug) {
  try {
    if (!slug) return null;
    const newsItem = await readClient.fetch(NEWS_BY_SLUG_QUERY, { slug });
    return newsItem || null;
  } catch (error) {
    console.error("Error fetching news by slug:", error);
    return null;
  }
}

// Get single activity by slug (for detail page)
export async function getActivityBySlug(slug) {
  try {
    if (!slug) return null;
    const activity = await readClient.fetch(ACTIVITY_BY_SLUG_QUERY, { slug });
    return activity || null;
  } catch (error) {
    console.error("Error fetching activity by slug:", error);
    return null;
  }
}

export async function getPublishedNewsletterActivities() {
  try {
    const activities = await readClient.fetch(
      PUBLISHED_NEWSLETTER_ACTIVITIES_QUERY
    );
    return activities || [];
  } catch (error) {
    console.error("Error fetching newsletter activities:", error);
    return [];
  }
}

// Get active top news banners (for newsletter page)
export async function getActiveTopNewsBanners() {
  try {
    // 1️⃣ Fetch only minimal data to find expired banners
    let banners = await writeClient.fetch(
      TOP_NEWS_BANNERS_FOR_EXPIRATION_QUERY
    );

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split("T")[0];

      const expired = (banners || []).filter((b) => {
        if (!b.isActive || !b.endDate) return false;
        const endDateStr = b.endDate.split("T")[0];
        return endDateStr < todayStr;
      });

      // 2️⃣ Auto-deactivate expired banners in Sanity
      if (expired.length > 0) {
        const tx = writeClient.transaction();
        expired.forEach((banner) => {
          tx.patch(banner._id, (p) => p.set({ isActive: false }));
        });
        await tx.commit();
      }
    } catch (err) {
      // Silent fail for auto-deactivation
    }

    // 3️⃣ Fetch full data ONLY for active and valid banners
    let activeBanners = await writeClient.fetch(ACTIVE_TOP_NEWS_BANNERS_QUERY);

    return activeBanners || [];
  } catch (error) {
    console.error("Error fetching top news banners:", error);
    return [];
  }
}

export async function subscribeToNewsletter(email) {
  try {
    // First, check if email already exists
    const existingSubscriber = await readClient.fetch(
      `*[_type == "newsletterSubscriber" && email == $email][0]`,
      { email }
    );

    // If subscriber exists and is active, return already subscribed message
    if (existingSubscriber && existingSubscriber.isActive) {
      return {
        success: false,
        alreadySubscribed: true,
        message: "هذا البريد الإلكتروني مشترك بالفعل",
      };
    }

    let isReactivation = false;

    // If subscriber exists but is inactive, reactivate them
    if (existingSubscriber && !existingSubscriber.isActive) {
      await writeClient
        .patch(existingSubscriber._id)
        .set({
          isActive: true,
          subscribedAt: new Date().toISOString(),
          unsubscribedAt: null,
        })
        .commit();

      isReactivation = true;
      console.log("Newsletter subscriber reactivated:", existingSubscriber._id);
    } else {
      // Create new subscriber
      const newSubscriber = await writeClient.create({
        _type: "newsletterSubscriber",
        email,
        isActive: true,
        subscribedAt: new Date().toISOString(),
      });

      console.log("New newsletter subscriber created:", newSubscriber._id);
    }

    // Send welcome email to subscriber (don't wait for it, run in background)
    sendNewsletterWelcomeEmail(email).catch((error) => {
      console.error("Failed to send welcome email:", error);
      // Don't fail the subscription if email fails
    });

    // Send notification to admins (optional, runs in background)
    if (process.env.SEND_ADMIN_NEWSLETTER_NOTIFICATIONS === "true") {
      sendNewsletterSubscriptionNotificationToAdmins(
        email,
        "newsletter_page"
      ).catch((error) => {
        console.error("Failed to send admin notification:", error);
        // Don't fail the subscription if admin email fails
      });
    }

    return {
      success: true,
      message: isReactivation ? "تم تفعيل اشتراكك بنجاح" : "تم الاشتراك بنجاح",
    };
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return {
      success: false,
      message: "حدث خطأ أثناء الاشتراك. الرجاء المحاولة مرة أخرى",
      error: error.message,
    };
  }
}

export async function unsubscribeFromNewsletter(email) {
  try {
    const subscriber = await readClient.fetch(
      `*[_type == "newsletterSubscriber" && email == $email && isActive == true][0]`,
      { email }
    );

    if (!subscriber) {
      return {
        success: false,
        message: "لم يتم العثور على اشتراك نشط لهذا البريد الإلكتروني",
      };
    }

    await writeClient
      .patch(subscriber._id)
      .set({
        isActive: false,
        unsubscribedAt: new Date().toISOString(),
      })
      .commit();

    console.log("Newsletter subscriber unsubscribed:", subscriber._id);

    sendNewsletterUnsubscribeEmail(email).catch((error) => {
      console.error("Failed to send unsubscribe email:", error);
    });

    return {
      success: true,
      message: "تم إلغاء الاشتراك بنجاح",
    };
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error);
    return {
      success: false,
      message: "حدث خطأ أثناء إلغاء الاشتراك. الرجاء المحاولة مرة أخرى",
      error: error.message,
    };
  }
}
