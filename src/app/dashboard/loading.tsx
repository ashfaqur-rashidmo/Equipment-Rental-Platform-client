"use client";

import React from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuSkeleton } from "@/components/ui/sidebar";

export default function DashboardLoading() {
  return (
    <div className="flex h-screen">
      <Sidebar className="w-64">
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {[1, 2, 3, 4, 5].map((i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-8 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-3/4 bg-base-200 rounded-lg" />
          <div className="h-4 w-1/2 bg-base-200 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-base-200 rounded-box animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-base-200 rounded-box animate-pulse" />
      </main>
    </div>
  );
}
