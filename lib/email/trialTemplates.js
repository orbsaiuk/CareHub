import { buildBasicHtmlEmail } from "@/lib/email";

/**
 * Trial welcome email template
 */
export function buildTrialWelcomeEmail(subscription, plan) {
    const trialEndDate = new Date(subscription.trialEndDate).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const daysRemaining = Math.ceil(
        (new Date(subscription.trialEndDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    const subject = `🎉 مرحباً بك في تجربتك المجانية - ${plan.name}`;

    const lines = [
        `عزيزنا ${subscription.tenantName},`,
        "",
        `مبارك! لقد بدأت تجربتك المجانية لخطة **${plan.name}** بنجاح.`,
        "",
        "**تفاصيل تجربتك المجانية:**",
        `• الخطة: ${plan.name}`,
        `• مدة التجربة: ${daysRemaining} يوم`,
        `• تاريخ الانتهاء: ${trialEndDate}`,
        "",
    ];

    const html = buildBasicHtmlEmail("مرحباً بك في تجربتك المجانية", lines, {
        primaryColor: "#10b981",
        buttonUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/business/packages`,
        buttonText: "انتقل إلى لوحة التحكم",
    });

    return { subject, html };
}

/**
 * Trial reminder email template
 * Sent 3 days before trial expires (via Stripe webhook)
 */
export function buildTrialReminderEmail(subscription, plan, daysRemaining) {
    const trialEndDate = new Date(subscription.trialEndDate).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const subject = `⏰ تنبيه: ${daysRemaining} أيام متبقية على انتهاء تجربتك المجانية`;

    const lines = [
        `عزيزنا ${subscription.tenantName},`,
        "",
        `تجربتك المجانية لخطة **${plan.name}** ستنتهي خلال **${daysRemaining} أيام** في ${trialEndDate}.`,
        "",
        "**لضمان استمرار الوصول:**",
        "• قم بالترقية قبل انتهاء التجربة",
        "• بياناتك ستبقى محفوظة بشكل آمن",
        "",
    ];

    const html = buildBasicHtmlEmail("تجربتك المجانية تنتهي قريباً", lines, {
        primaryColor: "#f59e0b",
        buttonUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/business/packages`,
        buttonText: "قم بالترقية الآن",
    });

    return { subject, html };
}

/**
 * Trial expired email template
 */
export function buildTrialExpiredEmail(subscription, plan) {
    const subject = `📢 انتهت تجربتك المجانية - قم بالترقية للاستمرار`;

    const lines = [
        `عزيزنا ${subscription.tenantName},`,
        "",
        `انتهت تجربتك المجانية لخطة **${plan.name}**.`,
        "",
        "**حالة حسابك:**",
        "• ✅ بياناتك محفوظة بشكل آمن",
        "• 🔒 تم إيقاف الوصول إلى المزايا المدفوعة",
        "",
        "قم بالترقية الآن لاستعادة الوصول الكامل.",
        "",
    ];

    const html = buildBasicHtmlEmail("انتهت تجربتك المجانية", lines, {
        primaryColor: "#ef4444",
        buttonUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/business/packages`,
        buttonText: "قم بالترقية الآن",
    });

    return { subject, html };
}

/**
 * Flexible trial welcome email template (no end date)
 */
export function buildFlexibleTrialWelcomeEmail(subscription, plan) {
    const subject = `🎉 مرحباً بك في تجربتك المجانية - ${plan.name}`;

    const lines = [
        `عزيزنا ${subscription.tenantName},`,
        "",
        `مبارك! لقد بدأت تجربتك المجانية لخطة **${plan.name}** بنجاح.`,
        "",
        "**تفاصيل تجربتك المجانية:**",
        `• الخطة: ${plan.name}`,
        "• مدة التجربة: مفتوحة",
        "",
        "استمتع بجميع مزايا الخطة خلال فترة التجربة.",
        "",
    ];

    const html = buildBasicHtmlEmail("مرحباً بك في تجربتك المجانية", lines, {
        primaryColor: "#10b981",
        buttonUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/business/packages`,
        buttonText: "انتقل إلى لوحة التحكم",
    });

    return { subject, html };
}

/**
 * Flexible trial converted to free plan email template
 */
export function buildFlexibleTrialConvertedEmail(subscription, freePlan) {
    const subject = `📢 تم تحويل حسابك إلى الباقة المجانية`;

    const lines = [
        `عزيزنا ${subscription.tenantName},`,
        "",
        `تم تحويل حسابك من التجربة المجانية إلى **${freePlan.name}**.`,
        "",
        "**حالة حسابك:**",
        "• ✅ بياناتك محفوظة بشكل آمن",
        `• 📦 أنت الآن على ${freePlan.name}`,
        "",
        "يمكنك الترقية في أي وقت للحصول على مزايا إضافية.",
        "",
    ];

    const html = buildBasicHtmlEmail("تم تحويل حسابك", lines, {
        primaryColor: "#3b82f6",
        buttonUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/business/packages`,
        buttonText: "عرض الباقات",
    });

    return { subject, html };
}
