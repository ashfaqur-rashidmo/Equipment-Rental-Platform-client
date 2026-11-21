import { requireRole } from '@/lib/core/server';
import React from 'react';

const CustomerDashboardLayout = async({children} : {children: React.ReactNode}) => {
    await requireRole("Customer")
    return children
};

export default CustomerDashboardLayout;