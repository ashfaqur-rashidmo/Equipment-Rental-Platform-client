"use client";

import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import CustomerDashboardSidebar from "@/app/component/CustomerDashboard/DashboardSidebar";
import OwnerDashboardSidebar from "@/app/component/OwnerDashboard/DashboardSidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;
  const isOwner = role === "owner";

  const DashboardSidebar = isOwner ? OwnerDashboardSidebar : CustomerDashboardSidebar;

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default layout;
