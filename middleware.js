import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
// Avoid calling Sanity from middleware (Edge). Use Clerk session claims instead.

const isProtectedRoute = createRouteMatcher([
  "/bookmarks(.*)",
  "/become(.*)",
  "/api/bookmarks(.*)",
  "/api/tenant-requests(.*)",
  "/api/messaging(.*)",
  "/api/event-requests(.*)",
  "/api/order-requests(.*)",
  "/api/subscriptions(.*)",
  "/api/offers(.*)",
  "/api/company/update(.*)",
  "/api/supplier/update(.*)",
  "/messages(.*)",
]);

const isBusinessRoute = createRouteMatcher(["/business(.*)"]);
const isBecomeRoute = createRouteMatcher(["/become(.*)"]);
const isMessagesRoute = createRouteMatcher(["/messages(.*)"]);
const isUserProfileRoute = createRouteMatcher(["/user-profile(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const pathname = req.nextUrl.pathname;

  // Early return for public endpoints - no auth checks needed
  if (
    pathname.startsWith("/api/offers/public") ||
    pathname.startsWith("/api/offers/tenant") ||
    pathname.startsWith("/api/promotional-banners/public") ||
    pathname.startsWith("/api/subscriptions/trial/check-expirations")
  ) {
    return NextResponse.next();
  }

  // Cache userRole to avoid multiple reads
  const getUserRole = async () => {
    if (sessionClaims?.role) {
      return sessionClaims.role;
    }
    if (userId) {
      try {
        const user = await clerkClient.users.getUser(userId);
        return user?.publicMetadata?.role ?? null;
      } catch {
        return null;
      }
    }
    return null;
  };


  // Check if route requires authentication
  if (isProtectedRoute(req)) {
    if (!userId) {
      const isAPI = req.nextUrl.pathname.startsWith("/api");
      if (isAPI) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Check if route requires business role (company or supplier)
  if (isBusinessRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    const userRole = await getUserRole();
    if (!userRole || (userRole !== "company" && userRole !== "supplier")) {
      return NextResponse.redirect(new URL("/become", req.url));
    }
  }

  // Prevent existing business users from accessing the become flow
  if (isBecomeRoute(req)) {
    if (userId) {
      const userRole = await getUserRole();
      if (userRole === "company" || userRole === "supplier") {
        return NextResponse.redirect(
          new URL(`/business/${userRole}/dashboard`, req.url)
        );
      }
    }
  }

  // Prevent business users (company/supplier) from accessing public messages
  if (isMessagesRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    const userRole = await getUserRole();
    if (userRole === "company" || userRole === "supplier") {
      return notFound();
    }
  }

  // Require authentication for user profile page
  if (isUserProfileRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
    // User is authenticated, allow access to user profile
  }

  // Prevent business users (company/supplier) from accessing onboarding page
  if (isOnboardingRoute(req)) {
    if (userId) {
      const userRole = await getUserRole();
      if (userRole === "company" || userRole === "supplier") {
        return NextResponse.redirect(
          new URL(`/business/${userRole}/dashboard`, req.url)
        );
      }
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
