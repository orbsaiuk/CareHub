import { NextResponse } from "next/server";
import { convertFlexibleTrialsToFree } from "@/services/sanity/subscriptions";
import { sendFlexibleTrialConvertedEmail } from "@/services/email/trialNotifications";
import { writeClient } from "@/sanity/lib/serverClient";

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

export async function POST(request) {
    try {
        if (SANITY_WEBHOOK_SECRET) {
            const signature = request.headers.get("sanity-webhook-signature");
            if (signature !== SANITY_WEBHOOK_SECRET) {
                return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
            }
        }

        const body = await request.json();
        const { _id, _type } = body;

        if (_type !== "plan" && !(_id && _id.includes("plan"))) {
            return NextResponse.json({ message: "Not a plan document" });
        }

        if (!_id) {
            return NextResponse.json({ message: "No document ID" }, { status: 400 });
        }

        const plan = await writeClient.fetch(`*[_type == "plan" && _id == $id][0]`, { id: _id });

        if (!plan) {
            return NextResponse.json({ message: "Plan not found" });
        }

        if (!plan.flexibleTrial) {
            const result = await convertFlexibleTrialsToFree(_id);

            if (result.subscriptions.length > 0) {
                for (const sub of result.subscriptions) {
                    sendFlexibleTrialConvertedEmail(sub).catch(() => { });
                }
            }

            return NextResponse.json({
                success: true,
                message: `Converted ${result.converted} subscriptions`,
                ...result,
            });
        }

        return NextResponse.json({ success: true, message: "No action needed" });
    } catch (error) {
        console.error("Plan webhook error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
