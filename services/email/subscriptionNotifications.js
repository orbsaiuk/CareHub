import { sendEmail, buildBasicHtmlEmail } from "@/lib/email";
import { sendEmailToAdmins } from "@/services/email/admin";
import { getSalesSubscriptionEmail } from "@/services/email/config";
import { writeClient } from "@/sanity/lib/serverClient";
import { clerkClient } from "@clerk/nextjs/server";
import { getPlanById } from "@/services/sanity/subscriptions";

async function getTenantEmail(tenantType, tenantId) {
    try {
        const query = `*[_type == $tenantType && tenantId == $tenantId][0]{
            "email": contact.email,
            "clerkId": clerkId
        }`;

        const tenant = await writeClient.fetch(query, { tenantType, tenantId });
        if (!tenant) return null;

        if (tenant.email) return tenant.email;

        if (tenant.clerkId) {
            try {
                const clerk = await clerkClient();
                const user = await clerk.users.getUser(tenant.clerkId);
                return user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
            } catch {
                return null;
            }
        }

        return null;
    } catch {
        return null;
    }
}

async function getUserEmail(tenantType, tenantId) {
    try {
        // Find the user/contact associated with this tenant
        // This query depends on your data model. 
        // For Company/Supplier, they usually have a 'contact' field or are linked to a User.

        const tenant = await writeClient.fetch(`*[_type == $tenantType && tenantId == $tenantId][0]`, {
            tenantType,
            tenantId
        });

        if (tenant?.contact?.email) return tenant.contact.email;
        if (tenant?.email) return tenant.email;

        // If no direct email, we might need to find the user owner.
        // Assuming there is an 'owner' reference or similar.
        // For now, return null if not found directly
        return null;
    } catch (e) {
        return null;
    }
}

/**
 * Notify admins about new subscription
 */
async function notifyAdminsNewSubscription(subscription, plan, userEmail) {
    try {
        const planName = plan?.name || "الباقة";
        const amount = plan?.price?.amount || 0;
        const currency = (plan?.price?.currency || "GBP").toUpperCase();

        const subject = `🎉 اشتراك جديد: ${planName}`;

        const html = buildBasicHtmlEmail(
            "اشتراك جديد في المنصة",
            [
                "مرحباً،",
                "",
                `تم تفعيل اشتراك جديد في المنصة.`,
                "",
                "**تفاصيل الاشتراك:**",
                `• البريد الإلكتروني: ${userEmail}`,
                `• نوع الحساب: ${subscription.tenantType === "company" ? "شركة" : "مورد"}`,
                `• الباقة: ${planName}`,
                amount > 0 ? `• السعر: ${amount} ${currency}` : "• السعر: مجاني",
                `• تاريخ البدء: ${new Date(subscription.startDate).toLocaleDateString("ar-EG")}`,
                subscription.endDate ? `• تاريخ الانتهاء: ${new Date(subscription.endDate).toLocaleDateString("ar-EG")}` : "",
                subscription.trialStatus === "active" ? "• الحالة: فترة تجريبية" : "",
                "",
                "فريق DatesHub"
            ],
            { primaryColor: "#10b981" }
        );

        await sendEmailToAdmins(subject, html);
    } catch (error) {
        console.error("Error notifying admins about new subscription:", error);
    }
}

/**
 * Notify admins about failed payment
 */
async function notifyAdminsPaymentFailed(payment, subscription, userEmail) {
    try {
        const amount = payment.amount?.total || 0;
        const currency = (payment.amount?.currency || "GBP").toUpperCase();

        const subject = `⚠️ فشل عملية دفع: ${userEmail}`;

        const html = buildBasicHtmlEmail(
            "تنبيه: فشل عملية دفع",
            [
                "مرحباً،",
                "",
                `فشلت محاولة دفع لأحد المشتركين.`,
                "",
                "**تفاصيل العملية:**",
                `• البريد الإلكتروني: ${userEmail}`,
                `• نوع الحساب: ${payment.tenantType === "company" ? "شركة" : "مورد"}`,
                `• المبلغ: ${amount} ${currency}`,
                `• رقم الفاتورة: ${payment.stripeInvoiceId || "N/A"}`,
                `• التاريخ: ${new Date(payment.transactionDate || Date.now()).toLocaleDateString("ar-EG")}`,
                `• السبب: ${payment.failureReason || "غير محدد"}`,
                "",
                "**يُنصح بالمتابعة مع العميل.**",
                "",
                "فريق DatesHub"
            ],
            { primaryColor: "#ef4444" }
        );

        await sendEmailToAdmins(subject, html);
    } catch (error) {
        console.error("Error notifying admins about payment failure:", error);
    }
}

export async function sendSubscriptionWelcomeEmail(subscription, plan) {
    try {
        let email = subscription.email;
        if (!email) {
            email = await getUserEmail(subscription.tenantType, subscription.tenantId);
        }

        if (!email) {
            console.warn("No email found for subscription welcome", subscription._id);
            return { ok: false, reason: "no email found" };
        }

        const planName = plan.name || "الباقة المختارة";
        const subject = `🎉 تفعيل اشتراكك في باقة ${planName}`;

        const html = buildBasicHtmlEmail(
            `تم تفعيل اشتراكك بنجاح`,
            [
                `مرحباً،`,
                "",
                `يسرنا إبلاغك بأنه تم تفعيل اشتراكك في **${planName}** بنجاح!`,
                "",
                "**تفاصيل الاشتراك:**",
                `• الباقة: ${planName}`,
                plan.price?.amount > 0 ? `• السعر: ${plan.price.amount} ${plan.price.currency?.toUpperCase() || "GBP"}` : "",
                `• تاريخ البدء: ${new Date(subscription.startDate).toLocaleDateString("ar-EG")}`,
                subscription.endDate ? `• تاريخ التجديد: ${new Date(subscription.endDate).toLocaleDateString("ar-EG")}` : "",
                "",
                "**المميزات التي حصلت عليها:**",
                ...(plan.features || []).filter(f => f.included).map(f => `• ${f.name}`),
                "",
                "**ماذا الآن؟**",
                "يمكنك الآن الاستفادة الكاملة من مميزات باقتك وتنمية نشاطك التجاري معنا.",
                "",
                "شكراً لثقتك في DatesHub!",
                "",
                "فريق DatesHub"
            ],
            {
                primaryColor: "#10b981",
                buttonUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/business/${subscription.tenantType}/dashboard`,
                buttonText: "الذهاب إلى لوحة التحكم"
            }
        );

        const result = await sendEmail({
            to: email,
            subject,
            html,
            from: `DatesHub Sales <${getSalesSubscriptionEmail()}>`
        });

        // Notify admins about new subscription
        await notifyAdminsNewSubscription(subscription, plan, email);

        return result;
    } catch (error) {
        console.error("Error sending subscription welcome email:", error);
        return { ok: false, error: String(error) };
    }
}

/**
 * Send welcome email for paid subscription (no trial)
 * Called when user subscribes to a plan without a trial period
 */
export async function sendPaidSubscriptionWelcomeEmail(subscription, planData = null) {
    try {
        const email = await getTenantEmail(subscription.tenantType, subscription.tenantId);
        if (!email) {
            console.warn("No email found for paid subscription welcome", subscription._id);
            return { ok: false, reason: "No email address found" };
        }

        // Get plan details if not provided
        let plan = planData;
        if (!plan && subscription.plan?._ref) {
            plan = await getPlanById(subscription.plan._ref);
        }
        if (!plan) {
            return { ok: false, reason: "Plan not found" };
        }

        const planName = plan.name || "الباقة المختارة";
        const subject = `🎉 مرحباً بك في باقة ${planName}!`;

        const lines = [
            "مرحباً،",
            "",
            `شكراً لاشتراكك في **${planName}**! تم تفعيل اشتراكك بنجاح ويمكنك الآن الاستفادة من جميع المميزات.`,
            "",
            "**تفاصيل اشتراكك:**",
            `• الباقة: ${planName}`,
        ];

        if (plan.price?.amount > 0) {
            lines.push(`• السعر: ${plan.price.amount} ${plan.price.currency?.toUpperCase() || "GBP"}`);
        }

        lines.push(`• تاريخ البدء: ${new Date(subscription.startDate).toLocaleDateString("ar-EG")}`);

        if (subscription.endDate) {
            lines.push(`• تاريخ التجديد التالي: ${new Date(subscription.endDate).toLocaleDateString("ar-EG")}`);
        }

        lines.push("");

        // Add features if available
        const includedFeatures = (plan.features || []).filter(f => f.included);
        if (includedFeatures.length > 0) {
            lines.push("**المميزات المتاحة لك:**");
            includedFeatures.forEach(f => lines.push(`• ${f.name}`));
            lines.push("");
        }

        lines.push(
            "**ابدأ الآن:**",
            "يمكنك الوصول إلى لوحة التحكم الخاصة بك وبدء استخدام جميع المميزات فوراً.",
            "",
            "إذا كان لديك أي استفسار، فريق الدعم لدينا جاهز لمساعدتك.",
            "",
            "شكراً لثقتك في DatesHub!",
            "",
            "فريق DatesHub"
        );

        const html = buildBasicHtmlEmail(
            "مرحباً بك في اشتراكك الجديد!",
            lines,
            {
                primaryColor: "#10b981",
                buttonUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/business/${subscription.tenantType}/dashboard`,
                buttonText: "الذهاب إلى لوحة التحكم"
            }
        );

        const result = await sendEmail({
            to: email,
            subject,
            html,
            from: `DatesHub Sales <${getSalesSubscriptionEmail()}>`
        });

        // Notify admins about new paid subscription
        await notifyAdminsNewSubscription(subscription, plan, email);

        return result.ok ? { ok: true } : { ok: false, error: result.error };
    } catch (error) {
        console.error("Error sending paid subscription welcome email:", error);
        return { ok: false, error: String(error) };
    }
}

export async function sendPaymentSuccessEmail(payment, subscription) {
    try {
        let email = await getUserEmail(payment.tenantType, payment.tenantId);
        if (!email) return { ok: false, reason: "no email found" };

        const subject = `✅ تم استلام دفعتك بنجاح`;
        const amount = payment.amount?.total || 0;
        const currency = payment.amount?.currency?.toUpperCase() || "GBP";

        const html = buildBasicHtmlEmail(
            "إيصال دفع",
            [
                "مرحباً،",
                "",
                `نؤكد لك استلام دفعتك بمبلغ **${amount} ${currency}** بنجاح.`,
                "",
                "**تفاصيل العملية:**",
                `• رقم الفاتورة: ${payment.stripeInvoiceId || "N/A"}`,
                `• التاريخ: ${new Date(payment.transactionDate).toLocaleDateString("ar-EG")}`,
                `• الحالة: ناجحة`,
                "",
                "تم تجديد اشتراكك تلقائياً.",
                "",
                "شكراً لاستخدامك DatesHub!",
                "فريق DatesHub"
            ],
            { primaryColor: "#10b981" }
        );

        return await sendEmail({
            to: email,
            subject,
            html,
            from: `DatesHub Sales <${getSalesSubscriptionEmail()}>`
        });
    } catch (error) {
        console.error("Error sending payment success email:", error);
        return { ok: false, error: String(error) };
    }
}

export async function sendPaymentFailedEmail(payment, subscription) {
    try {
        let email = await getUserEmail(payment.tenantType, payment.tenantId);
        if (!email) return { ok: false, reason: "no email found" };

        const subject = `⚠️ فشل عملية الدفع`;
        const html = buildBasicHtmlEmail(
            "تنبيه حول عملية الدفع",
            [
                "مرحباً،",
                "",
                "نأسف لإبلاغك بأن محاولة تجديد اشتراكك الأخيرة لم تكلل بالنجاح.",
                "",
                "قد يكون السبب انتهاء صلاحية البطاقة أو رصيد غير كافي.",
                "",
                "**يرجى تحديث معلومات الدفع الخاصة بك لضمان استمرار الخدمة وتجنب توقف الاشتراك.**",
                "",
                "فريق DatesHub"
            ],
            {
                primaryColor: "#ef4444",
                buttonUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/business/${payment.tenantType}/settings/billing`,
                buttonText: "تحديث معلومات الدفع"
            }
        );

        const result = await sendEmail({
            to: email,
            subject,
            html,
            from: `DatesHub Sales <${getSalesSubscriptionEmail()}>`
        });

        // Notify admins about payment failure
        await notifyAdminsPaymentFailed(payment, subscription, email);

        return result;
    } catch (error) {
        console.error("Error sending payment failed email:", error);
        return { ok: false, error: String(error) };
    }
}

/**
 * Send subscription cancellation email
 * Different content based on whether subscription had a trial or not
 * Subscription remains active until end date, then won't renew
 */
export async function sendSubscriptionCancelledEmail(subscription) {
    try {
        const email = await getTenantEmail(subscription.tenantType, subscription.tenantId);
        if (!email) {
            console.warn("No email found for subscription cancellation", subscription._id);
            return { ok: false, reason: "No email address found" };
        }

        // Get plan details
        const planId = subscription.plan?._ref || subscription.plan?._id;
        let plan = null;
        if (planId) {
            plan = await getPlanById(planId);
        }
        const planName = plan?.name || "الباقة";

        // Check if subscription had a trial (active trial that hasn't converted)
        const hadActiveTrial = subscription.trialStatus === "active" && subscription.trialEndDate;

        let subject, title, lines;

        if (hadActiveTrial) {
            // Cancellation email for subscription with active trial
            const trialEndDateFormatted = new Date(subscription.trialEndDate).toLocaleDateString("ar-EG");

            subject = `تم إلغاء تجديد اشتراكك في ${planName}`;
            title = "تم إلغاء تجديد الاشتراك";
            lines = [
                "مرحباً،",
                "",
                `تم إلغاء تجديد اشتراكك في **${planName}** بنجاح.`,
                "",
                "**ماذا يعني هذا؟**",
                `• ستستمر فترتك التجريبية حتى **${trialEndDateFormatted}**`,
                "• يمكنك الاستفادة من جميع المميزات حتى انتهاء الفترة التجريبية",
                "• لن يتم تحصيل أي مبلغ منك",
                "• بعد انتهاء الفترة التجريبية، لن يتم تجديد الاشتراك تلقائياً",
                "",
                "**نأمل أن تستفيد من الفترة التجريبية المتبقية!**",
                "",
                "إذا كان لديك أي ملاحظات أو أسباب للإلغاء، نود سماعها لتحسين خدماتنا.",
                "",
                "**هل غيرت رأيك؟**",
                "يمكنك إعادة تفعيل الاشتراك في أي وقت قبل انتهاء الفترة التجريبية.",
                "",
                "نتمنى لك التوفيق!",
                "",
                "فريق DatesHub"
            ];
        } else {
            // Cancellation email for paid subscription (no trial or trial already converted)
            const endDateFormatted = subscription.endDate
                ? new Date(subscription.endDate).toLocaleDateString("ar-EG")
                : null;

            subject = `تم إلغاء تجديد اشتراكك في ${planName}`;
            title = "تم إلغاء تجديد الاشتراك";
            lines = [
                "مرحباً،",
                "",
                `تم إلغاء تجديد اشتراكك في **${planName}** بنجاح.`,
                "",
                "**ماذا يعني هذا؟**",
            ];

            if (endDateFormatted) {
                lines.push(
                    `• سيظل اشتراكك فعالاً حتى **${endDateFormatted}**`,
                    "• يمكنك الاستفادة من جميع المميزات حتى تاريخ انتهاء الاشتراك"
                );
            }

            lines.push(
                "• لن يتم تجديد اشتراكك تلقائياً بعد انتهاء الفترة الحالية",
                "• لن يتم تحصيل أي مبالغ إضافية",
                "",
                "**تفاصيل الإلغاء:**",
                `• الباقة: ${planName}`,
                `• تاريخ طلب الإلغاء: ${new Date().toLocaleDateString("ar-EG")}`
            );

            if (endDateFormatted) {
                lines.push(`• تاريخ انتهاء الاشتراك: ${endDateFormatted}`);
            }

            lines.push(
                "",
                "**نأسف لرؤيتك تغادر!**",
                "",
                "إذا كان هناك أي شيء يمكننا فعله لتحسين تجربتك، يرجى إخبارنا.",
                "",
                "**هل غيرت رأيك؟**",
                "يمكنك إعادة تفعيل الاشتراك في أي وقت قبل انتهاء الفترة الحالية.",
                "",
                "شكراً لاستخدامك DatesHub!",
                "",
                "فريق DatesHub"
            );
        }

        const html = buildBasicHtmlEmail(
            title,
            lines,
            {
                primaryColor: "#6b7280",
                buttonUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/business/${subscription.tenantType}/settings/billing`,
                buttonText: "إعادة تفعيل الاشتراك"
            }
        );

        const result = await sendEmail({
            to: email,
            subject,
            html,
            from: `DatesHub Sales <${getSalesSubscriptionEmail()}>`
        });
        return result.ok ? { ok: true } : { ok: false, error: result.error };
    } catch (error) {
        console.error("Error sending subscription cancelled email:", error);
        return { ok: false, error: String(error) };
    }
}

/**
 * Send subscription renewed email
 * Called when subscription is automatically renewed after successful payment
 */
export async function sendSubscriptionRenewedEmail(subscription, payment) {
    try {
        const email = await getTenantEmail(subscription.tenantType, subscription.tenantId);
        if (!email) {
            console.warn("No email found for subscription renewal", subscription._id);
            return { ok: false, reason: "No email address found" };
        }

        // Get plan details
        const planId = subscription.plan?._ref || subscription.plan?._id;
        let plan = null;
        if (planId) {
            plan = await getPlanById(planId);
        }
        const planName = plan?.name || "الباقة";

        const amount = payment?.amount?.total || plan?.price?.amount || 0;
        const currency = (payment?.amount?.currency || plan?.price?.currency || "GBP").toUpperCase();

        const subject = `✅ تم تجديد اشتراكك في ${planName}`;

        const lines = [
            "مرحباً،",
            "",
            `تم تجديد اشتراكك في **${planName}** بنجاح!`,
            "",
            "**تفاصيل التجديد:**",
            `• الباقة: ${planName}`,
            `• المبلغ: ${amount} ${currency}`,
            `• تاريخ التجديد: ${new Date().toLocaleDateString("ar-EG")}`,
        ];

        if (subscription.endDate) {
            lines.push(`• تاريخ التجديد القادم: ${new Date(subscription.endDate).toLocaleDateString("ar-EG")}`);
        }

        lines.push(
            "",
            "شكراً لاستمرارك معنا! نتمنى لك تجربة مميزة.",
            "",
            "فريق DatesHub"
        );

        const html = buildBasicHtmlEmail(
            "تم تجديد اشتراكك بنجاح",
            lines,
            {
                primaryColor: "#10b981",
                buttonUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/business/${subscription.tenantType}/dashboard`,
                buttonText: "الذهاب إلى لوحة التحكم"
            }
        );

        const result = await sendEmail({
            to: email,
            subject,
            html,
            from: `DatesHub Sales <${getSalesSubscriptionEmail()}>`
        });
        return result.ok ? { ok: true } : { ok: false, error: result.error };
    } catch (error) {
        console.error("Error sending subscription renewed email:", error);
        return { ok: false, error: String(error) };
    }
}

/**
 * Send subscription deleted email
 * Called when subscription is permanently deleted (not just cancelled)
 * This is the final state - subscription cannot be reactivated
 */
export async function sendSubscriptionDeletedEmail(subscription) {
    try {
        const email = await getTenantEmail(subscription.tenantType, subscription.tenantId);
        if (!email) {
            console.warn("No email found for subscription deletion", subscription._id);
            return { ok: false, reason: "No email address found" };
        }

        // Get plan details
        const planId = subscription.plan?._ref || subscription.plan?._id;
        let plan = null;
        if (planId) {
            plan = await getPlanById(planId);
        }
        const planName = plan?.name || "الباقة";

        const subject = `تم إنهاء اشتراكك في ${planName}`;

        const lines = [
            "مرحباً،",
            "",
            `نود إعلامك بأن اشتراكك في **${planName}** قد انتهى بشكل نهائي.`,
            "",
            "**تفاصيل الاشتراك المنتهي:**",
            `• الباقة: ${planName}`,
            `• تاريخ الإنهاء: ${new Date().toLocaleDateString("ar-EG")}`,
            "",
            "**ماذا يعني هذا؟**",
            "• لم يعد بإمكانك الوصول إلى مميزات الباقة",
            "• تم إيقاف جميع الخدمات المرتبطة بالاشتراك",
            "• لن يتم تحصيل أي مبالغ مستقبلية",
            "",
            "**هل ترغب في العودة؟**",
            "يمكنك الاشتراك مجدداً في أي وقت واختيار الباقة المناسبة لك.",
            "",
            "نشكرك على الفترة التي قضيتها معنا ونتمنى لك التوفيق!",
            "",
            "فريق DatesHub"
        ];

        const html = buildBasicHtmlEmail(
            "تم إنهاء اشتراكك",
            lines,
            {
                primaryColor: "#ef4444",
                buttonUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/business/${subscription.tenantType}/pricing`,
                buttonText: "استعراض الباقات"
            }
        );

        const result = await sendEmail({
            to: email,
            subject,
            html,
            from: `DatesHub Sales <${getSalesSubscriptionEmail()}>`
        });
        return result.ok ? { ok: true } : { ok: false, error: result.error };
    } catch (error) {
        console.error("Error sending subscription deleted email:", error);
        return { ok: false, error: String(error) };
    }
}
