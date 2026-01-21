import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { STATIC_CONTACT_CONTENT_QUERY } from "@/sanity/queries/staticContactContent";
import { STATIC_MEDIA_CONTENT_QUERY } from "@/sanity/queries/staticMediaContent";
import { sendEmail, buildBasicHtmlEmail } from "@/lib/email";
import { getUserSupportEmail, getNewsMediaEmail } from "@/services/email";

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, phone, whatsapp, email, message, source = "contact" } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                {
                    success: false,
                    message: "الرجاء ملء جميع الحقول المطلوبة",
                },
                { status: 400 }
            );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "صيغة البريد الإلكتروني غير صحيحة",
                },
                { status: 400 }
            );
        }

        // Get admin email based on source
        let adminEmail;
        if (source === "media") {
            // Use news/media email for media inquiries
            adminEmail = getNewsMediaEmail();
            // Fallback to Sanity config if needed
            if (!adminEmail) {
                const mediaContent = await client.fetch(STATIC_MEDIA_CONTENT_QUERY);
                adminEmail = mediaContent?.contactInfo?.email;
            }
        } else {
            // Use user support email for general contact
            adminEmail = getUserSupportEmail();
            // Fallback to Sanity config if needed
            if (!adminEmail) {
                const content = await client.fetch(STATIC_CONTACT_CONTENT_QUERY);
                adminEmail = content?.contactInfo?.email;
            }
        }

        if (!adminEmail) {
            console.error("Admin email not configured in Sanity");
            return NextResponse.json(
                {
                    success: false,
                    message: "حدث خطأ في الخادم. الرجاء المحاولة مرة أخرى",
                },
                { status: 500 }
            );
        }

        // Prepare email content
        const emailLines = [
            "تفاصيل الرسالة",

            `الاسم: ${name}`,
            phone ? `رقم الهاتف: ${phone}` : "",
            whatsapp ? `واتساب: ${whatsapp}` : "",
            `البريد الإلكتروني: ${email}`,
            "",
            "الرسالة:",
            message,
            "",
        ].filter(Boolean);

        const html = buildBasicHtmlEmail("رسالة جديدة من نموذج التواصل", emailLines, {
            primaryColor: "#16a34a",
        });

        // Send email to admin
        const emailResult = await sendEmail({
            to: adminEmail,
            subject: `رسالة جديدة من ${name} - نموذج التواصل`,
            html,
            text: emailLines.join("\n"),
        });

        if (!emailResult.ok) {
            console.error("Failed to send contact email:", emailResult);
            return NextResponse.json(
                {
                    success: false,
                    message: "حدث خطأ في إرسال الرسالة. الرجاء المحاولة مرة أخرى",
                },
                { status: 500 }
            );
        }

        // Send auto-reply to user
        const autoReplyLines = [
            `مرحباً ${name}،`,
            "",
            "شكراً لتواصلك معنا!",
            "",
            "لقد استلمنا رسالتك وسيقوم فريقنا بمراجعتها والرد عليك في أقرب وقت ممكن.",
            "",
            "تفاصيل رسالتك:",
            `الموضوع: ${message.substring(0, 100)}${message.length > 100 ? "..." : ""}`,
            "",
            "إذا كان لديك أي استفسارات عاجلة، يمكنك التواصل معنا مباشرة عبر:",
            phone ? `📱 الهاتف: ${phone}` : "",
            whatsapp ? `💬 واتساب: ${whatsapp}` : "",
            `📧 البريد الإلكتروني: ${adminEmail}`,
            "",
            "نتطلع للتواصل معك قريباً!",
            "",
            "مع أطيب التحيات،",
            "فريق DatesHub",
        ].filter(Boolean);

        const autoReplyHtml = buildBasicHtmlEmail("شكراً لتواصلك معنا", autoReplyLines, {
            primaryColor: "#16a34a",
        });

        // Send auto-reply (don't fail the request if this fails)
        await sendEmail({
            to: email,
            subject: "شكراً لتواصلك معنا - DatesHub",
            html: autoReplyHtml,
            text: autoReplyLines.join("\n"),
        }).catch((error) => {
            console.error("Failed to send auto-reply email:", error);
        });

        return NextResponse.json(
            {
                success: true,
                message: "تم إرسال رسالتك بنجاح. سنتواصل معك قريباً",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Contact form submission error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "حدث خطأ في الخادم. الرجاء المحاولة مرة أخرى",
            },
            { status: 500 }
        );
    }
}
