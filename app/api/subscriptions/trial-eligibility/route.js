import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserCompany, getUserSupplier } from "@/services/sanity/entities";
import { checkTrialEligibility } from "@/services/trial";
import { getAllPlans } from "@/services/sanity/subscriptions";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get tenant info
        const [company, supplier] = await Promise.all([
            getUserCompany(userId),
            getUserSupplier(userId),
        ]);

        const tenant = company || supplier;
        if (!tenant) {
            return NextResponse.json({ error: "No tenant found" }, { status: 404 });
        }

        const tenantType = company ? "company" : "supplier";
        const tenantId = tenant.tenantId;

        // Get all plans
        const plans = await getAllPlans();

        // Check eligibility for each plan that has trial
        const eligibilityMap = {};
        for (const plan of plans) {
            if (plan.trialDays > 0 || plan.flexibleTrial) {
                const result = await checkTrialEligibility(tenantType, tenantId, plan._id);
                eligibilityMap[plan._id] = result.eligible;
            }
        }

        return NextResponse.json({ eligibility: eligibilityMap });
    } catch (error) {
        console.error("Trial eligibility check error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
