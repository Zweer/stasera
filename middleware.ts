import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Protected routes will check session server-side
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
