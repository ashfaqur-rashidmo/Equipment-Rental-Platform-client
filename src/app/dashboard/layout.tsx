import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import DashboardSidebar from '../component/CustomerDashboard/DashboardSidebar';


const layout = ({ children }: { children: React.ReactNode }) => {
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