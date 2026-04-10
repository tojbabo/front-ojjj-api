import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_REFRESH_COOKIE } from "@/src/auth/cookieNames";

function hasSessionCookie(request: NextRequest): boolean {
  const refresh = request.cookies.get(AUTH_REFRESH_COOKIE)?.value;
  return Boolean(refresh?.length);
}

export function middleware(request: NextRequest) {
  if (hasSessionCookie(request)) {
    return NextResponse.next();
  }

  const signIn = new URL("/login", request.url);

  signIn.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  
  return NextResponse.redirect(signIn);
}

export const config = {
  matcher: ["/user", "/user/:path*"],
};