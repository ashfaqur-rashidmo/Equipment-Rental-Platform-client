"use client";

import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import CustomerDashboardSidebar from "@/app/component/CustomerDashboard/DashboardSidebar";
import OwnerDashboardSidebar from "@/app/component/OwnerDashboard/DashboardSidebar";
import AdminDashboardSidebar from "@/app/component/AdminDashboard/AdminDashboardSidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;

  let DashboardSidebar = CustomerDashboardSidebar;
  if (role === "owner") {
    DashboardSidebar = OwnerDashboardSidebar;
  } else if (role === "admin") {
    DashboardSidebar = AdminDashboardSidebar;
  }

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
