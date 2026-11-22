"use client";

import { useSession } from "@/lib/auth-client";
import { useLogOut } from "@/lib/logout";
import { siteConfig, DASHBOARD_ROUTES, UserRole } from "@/config/site";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import Logo from "./logo";

// The scrolled state lives in the DOM (scroll position), read via
// useSyncExternalStore so no effects or cascading setState are needed.
function subscribeScroll(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
}

function getScrolled() {
  return window.scrollY > 8;
}

function getScrolledServer() {
  return false;
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}


export function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const logout = useLogOut();

  const dashboardPath = user
    ? DASHBOARD_ROUTES[
        ((user as { role?: string }).role || "Customer") as UserRole
      ].path
    : "";

  const scrolled = useSyncExternalStore(
    subscribeScroll,
    getScrolled,
    getScrolledServer
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMenus() {
    setMobileOpen(false);
  }

  async function handleSignOut() {
    closeMenus();
    await logout();
  }

  const linkClass = (href: string) =>
    `btn btn-ghost btn-sm ${
      isActive(pathname, href)
        ? "font-semibold text-primary"
        : "text-base-content/70 hover:text-base-content"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b border-base-300/60 bg-base-100/70 backdrop-blur-xl backdrop-saturate-150 transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-none"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={linkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {isPending ? (
            <div className="flex items-center gap-2 px-2">
              <div className="skeleton h-9 w-9 rounded-full" />
              <div className="skeleton hidden h-4 w-16 sm:block" />
            </div>
          ) : user ? (
            /* Desktop avatar — links to the logged-in user's dashboard. */
            <Link
              href={dashboardPath}
              className="hidden lg:block flex items-center gap-2 px-3 py-1.5 rounded-full bg-base-200 hover:bg-base-300 border border-base-300/50 transition-colors"
              aria-label="Open dashboard"
            >
              <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden border border-base-300/50">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary text-xs font-semibold text-primary-content">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </Link>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Link href="/login" className="btn btn-ghost btn-sm text-base-content/80">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="btn btn-circle btn-ghost lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile / tablet dropdown panel */}
      {mobileOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 top-16 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-x-0 top-16 z-50 border-b border-base-300 bg-base-100/95 shadow-xl backdrop-blur-xl">
            <nav className="menu w-full px-4 py-3" aria-label="Mobile">
              <ul>
                {siteConfig.navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMenus}
                      className={
                        isActive(pathname, link.href)
                          ? "font-semibold text-primary"
                          : "text-base-content/80"
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="divider my-2" />

              {isPending ? (
                <div className="skeleton h-10 w-full" />
              ) : user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-2 py-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-content">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-base-content/60">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={
                      DASHBOARD_ROUTES[
                        ((user as { role?: string }).role ||
                          "Customer") as UserRole
                      ].path
                    }
                    onClick={closeMenus}
                    className="btn btn-primary btn-block btn-sm"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="btn btn-ghost btn-block btn-sm text-error"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={closeMenus}
                    className="btn btn-outline btn-block btn-sm"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMenus}
                    className="btn btn-primary btn-block btn-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
