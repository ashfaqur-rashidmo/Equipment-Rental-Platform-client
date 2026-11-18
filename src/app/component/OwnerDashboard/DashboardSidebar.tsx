"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { DASHBOARD_ROUTES, UserRole } from "@/config/site";
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
import { Package, CalendarClock, User, LogOut } from "lucide-react";

const navItems = DASHBOARD_ROUTES.Owner.subRoutes ?? [];

export default function OwnerDashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Sidebar>
      <SidebarHeader className="px-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase() || "O"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground">
              {user?.name || "Owner"}
            </p>
            <p className="text-xs text-sidebar-foreground/60">
              Equipment Owner
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = isActive(item.path);
                const Icon =
                  item.label === "My Equipment"
                    ? Package
                    : item.label === "My Equipment Rental"
                      ? CalendarClock
                      : User;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      render={
                        <Link
                          href={item.path}
                          className="w-full"
                          onClick={() => {}}
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
                    <Link
                      href="/login"
                      className="w-full text-destructive"
                      onClick={() => {}}
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      <span>Logout</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 pb-4">
        <button className="btn btn-outline btn-sm w-full">Settings</button>
      </SidebarFooter>
    </Sidebar>
  );
}
