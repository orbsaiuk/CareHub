import { sendEmail, buildBasicHtmlEmail } from "@/lib/email";
import { getAdminEmails, sendEmailToAdmins } from "@/services/email";

export async function sendNewsletterWelcomeEmail(email) {
  try {
    if (!email) {
      return { ok: false, reason: "no email address provided" };
    }

    const subject = "🎉 مرحباً بك في النشرة الإخبارية لـ DatesHub";
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;

    const html = buildBasicHtmlEmail(
      "أهلاً بك في عائلة DatesHub",
      [
        "عزيزنا المشترك الكريم،",
        "",
        "شكراً لانضمامك إلى النشرة الإخبارية لمنصة DatesHub! نحن سعداء جداً بوجودك معنا.",
        "",
        "**ماذا ستحصل عليه من نشرتنا الإخبارية؟**",
        "• آخر الأخبار والتحديثات في عالم التمور",
        "• عروض حصرية وخصومات مميزة للمشتركين",
        "• نصائح وإرشادات حول اختيار وتخزين التمور",
        "• قصص نجاح من شركائنا ومنتجينا",
        "• تحديثات عن المنتجات والخدمات الجديدة",
        "• دعوات حصرية للفعاليات والمؤتمرات",
        "",
        "**تابعنا على وسائل التواصل الاجتماعي:**",
        "للبقاء على اطلاع دائم، تابع منصتنا على مواقع التواصل الاجتماعي للحصول على تحديثات يومية وعروض فورية.",
        "",
        "**استكشف منصتنا:**",
        "قم بزيارة موقعنا لاكتشاف مجموعة واسعة من الموردين والشركات المتخصصة في التمور، وتصفح آلاف المنتجات والعروض المتاحة.",
        "",
        "💡 **نصيحة:** تحقق من بريدك الإلكتروني بانتظام حتى لا تفوتك أي عروض حصرية!",
        "",
        "إذا كانت لديك أي أسئلة أو اقتراحات، لا تتردد في التواصل معنا. نحن هنا لخدمتك!",
        "",
        "---",
        "",
        `إذا كنت لا ترغب في تلقي رسائلنا الإخبارية، يمكنك <a href="${unsubscribeUrl}" style="color: #6b7280; text-decoration: underline;">إلغاء الاشتراك هنا</a>.`,
        "",
        "مع أطيب التمنيات بتجربة ممتعة ومفيدة،",
        "فريق DatesHub",
      ],
      {
        primaryColor: "#10b981",
        buttonUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        buttonText: "زيارة الموقع",
      }
    );

    const emailResult = await sendEmail({ to: email, subject, html });

    if (emailResult.ok) {
      console.log("Newsletter welcome email sent successfully to:", email);
      return { ok: true, data: emailResult.data };
    } else {
      console.error(
        "Failed to send newsletter welcome email:",
        emailResult.error || emailResult.reason
      );
      return { ok: false, error: emailResult.error || emailResult.reason };
    }
  } catch (error) {
    console.error("Error sending newsletter welcome email:", error);
    return { ok: false, error: String(error) };
  }
}

export async function sendNewsletterSubscriptionNotificationToAdmins(email) {
  try {
    const adminEmails = getAdminEmails();

    if (adminEmails.length === 0) {
      console.log("No admin emails configured, skipping admin notification");
      return { ok: false, reason: "no admin emails configured" };
    }

    const subscribedDate = new Date().toLocaleDateString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;

    const subject = `📧 مشترك جديد في النشرة الإخبارية - ${email}`;

    const html = buildBasicHtmlEmail(
      "مشترك جديد في النشرة الإخبارية",
      [
        "مرحباً،",
        "",
        "تم تسجيل مشترك جديد في النشرة الإخبارية للمنصة.",
        "",
        "**تفاصيل الاشتراك:**",
        `• البريد الإلكتروني: ${email}`,
        `• تاريخ الاشتراك: ${subscribedDate}`,
        "",
        "**معلومات إضافية:**",
        "يمكنك عرض وإدارة جميع المشتركين من لوحة تحكم Sanity Studio تحت قسم Newsletter → Subscribers.",
        "",
        `**إجراءات سريعة:** <a href="${unsubscribeUrl}" style="color: #6366f1; text-decoration: underline;">إلغاء اشتراك هذا المستخدم</a>`,
        "",
        "💡 **تذكير:** احرص على إرسال محتوى قيم ومنتظم للمشتركين للحفاظ على تفاعلهم وولائهم للمنصة.",
        "",
        "فريق DatesHub - نظام الإشعارات الآلي",
      ],
      {
        primaryColor: "#6366f1",
        buttonUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/studio/structure/Newsletter;Subscribers`,
        buttonText: "عرض في Sanity Studio",
      }
    );

    const result = await sendEmailToAdmins(subject, html);

    if (result.ok) {
      console.log(
        `Admin notification sent: ${result.data.successful}/${result.data.total} emails delivered`
      );
      return { ok: true, data: result.data };
    } else {
      console.error(
        "Failed to send admin notification:",
        result.error || result.reason
      );
      return { ok: false, error: result.error || result.reason };
    }
  } catch (error) {
    console.error("Error sending admin notification:", error);
    return { ok: false, error: String(error) };
  }
}

export async function sendNewsletterUnsubscribeEmail(email) {
  try {
    if (!email) {
      return { ok: false, reason: "no email address provided" };
    }

    const subject = "👋 نأسف لرحيلك - DatesHub";

    const resubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/newsletter`;

    const html = buildBasicHtmlEmail(
      "تم إلغاء اشتراكك بنجاح",
      [
        "عزيزنا السابق،",
        "",
        "تم إلغاء اشتراكك في النشرة الإخبارية لـ DatesHub بنجاح. لن تتلقى المزيد من رسائلنا الإخبارية.",
        "",
        "**نأسف لرحيلك!**",
        "نود أن نعرف رأيك - هل هناك شيء كان يمكننا تحسينه؟ ملاحظاتك مهمة جداً لنا وتساعدنا على تقديم خدمة أفضل.",
        "",
        "**هل كان قرارك خطأ؟**",
        "إذا قمت بإلغاء الاشتراك عن طريق الخطأ، أو غيرت رأيك، يمكنك الاشتراك مجدداً في أي وقت بكل سهولة.",
        "",
        "**ستبقى دائماً موضع ترحيب:**",
        "بابنا مفتوح دائماً. يمكنك العودة والاشتراك في النشرة الإخبارية متى أردت، وسنكون سعداء باستقبالك مرة أخرى!",
        "",
        "شكراً لكونك جزءاً من مجتمع DatesHub. نتمنى لك كل التوفيق!",
        "",
        "مع أطيب التمنيات،",
        "فريق DatesHub",
      ],
      {
        primaryColor: "#f59e0b",
        buttonUrl: resubscribeUrl,
        buttonText: "إعادة الاشتراك",
      }
    );

    const emailResult = await sendEmail({ to: email, subject, html });

    if (emailResult.ok) {
      console.log("Newsletter unsubscribe email sent successfully to:", email);
      return { ok: true, data: emailResult.data };
    } else {
      console.error(
        "Failed to send unsubscribe email:",
        emailResult.error || emailResult.reason
      );
      return { ok: false, error: emailResult.error || emailResult.reason };
    }
  } catch (error) {
    console.error("Error sending unsubscribe email:", error);
    return { ok: false, error: String(error) };
  }
}
