"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useLogOut } from "@/lib/logout";
import { DASHBOARD_ROUTES, UserRole, siteConfig } from "@/config/site";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Package,
  CalendarClock,
  User,
  Forklift,
  LogOut,
} from "lucide-react";

const navItems = DASHBOARD_ROUTES.Admin.subRoutes ?? [];

export default function AdminDashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const logout = useLogOut();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Sidebar>
      <SidebarHeader className="flex gap-4 border-b border-sidebar-border px-4 py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-content shadow-sm">
            <Forklift className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-base font-bold tracking-tight text-sidebar-foreground">
            {siteConfig.name}
          </span>
        </Link>

        {/* User profile — avatar centered horizontally (x-axis), name after the image */}
        {user && (
          <div className="flex-1 flex justify-center items-center gap-3 min-w-0">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-sidebar-border">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary text-xs font-semibold text-primary-content">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/60">
                {(user as { role?: string })?.role || "Admin"}
              </p>
            </div>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = isActive(item.path);
                const Icon =
                  item.label === "Overview"
                    ? LayoutDashboard
                    : item.label === "All Users"
                      ? Users
                      : item.label === "All Equipment"
                        ? Package
                        : item.label === "All Rentals"
                          ? CalendarClock
                          : User;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      render={
                        <Link
                          href={item.path}
                          className="w-full"
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      }
                      isActive={active}
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full text-destructive"
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      <span>Logout</span>
                    </button>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 pb-4">
        <Link
          href="/dashboard/admin/profile"
          className="btn btn-outline btn-sm w-full"
        >
          System Settings
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
