import { requireRole } from '@/lib/core/server';
import React from 'react';

const OwnerDashboardLayout = async({children} : {children: React.ReactNode}) => {
    await requireRole("Owner")
    return children
};

export default OwnerDashboardLayout;