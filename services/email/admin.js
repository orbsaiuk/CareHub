import { sendEmail } from "@/lib/email";
import { getAdminApprovalEmail } from "./config";

export function getAdminEmails() {
    const adminEmail = getAdminApprovalEmail();
    return adminEmail ? [adminEmail] : [];
}

export async function sendEmailToAdmins(subject, html) {
    const adminEmails = getAdminEmails();

    if (adminEmails.length === 0) {
        return { ok: false, reason: "no admin emails configured" };
    }

    const emailPromises = adminEmails.map((adminEmail) =>
        sendEmail({ to: adminEmail, subject, html })
    );

    try {
        const results = await Promise.allSettled(emailPromises);
        const successful = results.filter(
            (result) => result.status === "fulfilled" && result.value.ok
        ).length;

        return {
            ok: true,
            data: {
                total: adminEmails.length,
                successful,
                failed: adminEmails.length - successful,
            },
        };
    } catch (error) {
        return { ok: false, error: error.message };
    }
}
