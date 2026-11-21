import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";

// Private routes (per the assignment requirements) — they require a
// logged-in user and redirect to the login page when the session is gone.
// The Equipment Details Page (/equipment/:id) is public.
const privatePaths = [
  "/dashboard/customer",
  "/dashboard/owner",
  "/dashboard/admin",
  "/all-equipment/:id",
];

function isPrivateRoute(pathname: string): boolean {
  return privatePaths.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`)
  );
}

export default async function proxy(request: NextRequest) {
  if (isPrivateRoute(request.nextUrl.pathname)) {
    const result = await auth.api.getSession({
      headers: request.headers,
    });

    if (!result?.session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}
