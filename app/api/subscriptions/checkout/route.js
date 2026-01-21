import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  createCheckoutSession,
  createTrialCheckoutSession,
  getOrCreateCustomer,
} from "@/services/stripe";
import { getUserCompany, getUserSupplier } from "@/services/sanity/entities";
import { getPlanById, createFlexibleTrial } from "@/services/sanity/subscriptions";
import { checkTrialEligibility } from "@/services/trial";
import { sendFlexibleTrialWelcomeEmail } from "@/services/email/trialNotifications";

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tenantType, tenantId, planId, stripePriceId } = await request.json();

    if (!tenantType || !tenantId || !planId) {
      return NextResponse.json(
        { error: "Missing required fields: tenantType, tenantId, planId" },
        { status: 400 }
      );
    }

    // Get plan details
    const plan = await getPlanById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Free plans don't need checkout
    if (plan.key === "free") {
      return NextResponse.json(
        { error: "Free plans don't require checkout" },
        { status: 400 }
      );
    }

    // Get tenant information
    let tenant;
    if (tenantType === "company") {
      tenant = await getUserCompany(userId);
    } else if (tenantType === "supplier") {
      tenant = await getUserSupplier(userId);
    }

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const effectiveTenantName =
      tenantType === "company" ? tenant?.company?.name : tenant?.supplier?.name;

    const origin = request.headers.get("origin");
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin || "http://localhost:3000";

    // Handle flexible trial (Sanity-only, no Stripe) - auto-start if plan has flexibleTrial
    if (plan.flexibleTrial) {
      const eligibility = await checkTrialEligibility(tenantType, tenantId, planId);
      if (eligibility.eligible) {
        const subscription = await createFlexibleTrial(
          tenantType,
          tenantId,
          effectiveTenantName,
          planId
        );

        // Send welcome email (non-blocking)
        sendFlexibleTrialWelcomeEmail(subscription).catch((err) =>
          console.error("Failed to send flexible trial welcome email:", err)
        );

        return NextResponse.json({
          success: true,
          isFlexibleTrial: true,
          subscriptionId: subscription._id,
          redirectUrl: `${appUrl}/business/${tenantType}/packages?success=true&trial=flexible`,
        });
      }
      // If not eligible for trial, continue to paid checkout
    }

    // Paid plans require Stripe
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    if (!stripePriceId && !plan.stripePriceId) {
      return NextResponse.json(
        { error: "Stripe price ID is required for paid plans" },
        { status: 400 }
      );
    }

    // Get user email for Stripe customer
    let derivedEmail = null;
    try {
      const user = await currentUser();
      derivedEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
    } catch {
      // Non-fatal
    }

    // Create or get Stripe customer
    const customer = await getOrCreateCustomer({
      email: derivedEmail,
      name: effectiveTenantName,
      tenantType,
      tenantId,
    });

    // Auto-start Stripe trial if plan has trialDays and user is eligible
    let shouldStartTrial = false;
    if (plan.trialDays > 0) {
      const eligibility = await checkTrialEligibility(tenantType, tenantId, planId);
      shouldStartTrial = eligibility.eligible;
    }

    const priceId = stripePriceId || plan.stripePriceId;
    let session;

    if (shouldStartTrial) {
      session = await createTrialCheckoutSession({
        priceId,
        customerId: customer.id,
        tenantType,
        tenantId,
        tenantName: effectiveTenantName,
        trialPeriodDays: plan.trialDays,
        planId,
        successUrl: `${appUrl}/business/${tenantType}/packages?success=true&trial=true`,
        cancelUrl: `${appUrl}/business/${tenantType}/packages?canceled=true`,
      });
    } else {
      session = await createCheckoutSession({
        priceId,
        customerId: customer.id,
        tenantType,
        tenantId,
        tenantName: effectiveTenantName,
        successUrl: `${appUrl}/business/${tenantType}/packages?success=true`,
        cancelUrl: `${appUrl}/business/${tenantType}/packages?canceled=true`,
      });
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: session?.url,
      sessionId: session?.id,
      isTrial: shouldStartTrial,
    });
  } catch (error) {
    console.error("Checkout error:", error.message);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
