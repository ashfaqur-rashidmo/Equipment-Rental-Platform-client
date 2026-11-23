import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
  if (!isPrivateRoute(request.nextUrl.pathname)) {
    // Public pages and static assets must never touch the database.
    return NextResponse.next();
  }

  try {
    // Loaded lazily so a cold start on a public/static request does not open
    // a MongoDB connection (that caused the Vercel connection storm).
    const { auth } = await import("@/lib/auth");
    const result = await auth.api.getSession({
      headers: request.headers,
    });

    if (!result?.session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (error) {
    // A database hiccup must not turn the page into a 500. Send the user to
    // login, where the session can be established again.
    console.error("Session check failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
