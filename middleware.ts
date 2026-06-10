import { type NextRequest, NextResponse } from "next/server";

// Routes that require a fully authenticated (non-guest) user
const PROTECTED_ROUTES = ["/onboarding"];

// API routes that require non-guest
const PROTECTED_API = [
  "/api/preferences",
  "/api/recommendations/feedback",
  "/api/push",
];

export function middleware(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl;

  const isProtectedPage = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isProtectedApi = PROTECTED_API.some((r) => pathname.startsWith(r));

  if (!isProtectedPage && !isProtectedApi) return undefined;

  // Check for session cookie (name varies by environment)
  const hasSession =
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__Secure-better-auth.session_token");

  if (!hasSession) {
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
    "/api/preferences/:path*",
    "/api/recommendations/feedback",
    "/api/push/:path*",
  ],
};
