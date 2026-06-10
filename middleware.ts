import { type NextRequest, NextResponse } from "next/server";

// Routes that require a fully authenticated (non-guest) user
const PROTECTED_ROUTES = ["/onboarding", "/profile"];

// API routes that require non-guest
const PROTECTED_API = [
  "/api/preferences",
  "/api/recommendations/feedback",
  "/api/push",
];

export function middleware(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl;

  // Check if route needs protection
  const isProtectedPage = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isProtectedApi = PROTECTED_API.some((r) => pathname.startsWith(r));

  if (!isProtectedPage && !isProtectedApi) return undefined;

  // Better Auth stores session in cookie — we check for anonymous flag
  // The actual auth check happens server-side in the route handlers
  // This middleware just provides a fast redirect for obvious guest navigations
  const sessionCookie = request.cookies.get("better-auth.session_token");
  if (!sessionCookie) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return undefined;
}

export const config = {
  matcher: [
    "/onboarding/:path*",
    "/profile/:path*",
    "/api/preferences/:path*",
    "/api/recommendations/feedback",
    "/api/push/:path*",
  ],
};
