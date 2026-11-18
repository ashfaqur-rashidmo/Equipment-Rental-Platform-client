"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { DASHBOARD_ROUTES, UserRole } from "@/config/site";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const { data: session } = useSession();
  const router = useRouter();
  const role = (session?.user as { role?: string })?.role;

  useEffect(() => {
    if (session) {
      const target = DASHBOARD_ROUTES[role as keyof typeof DASHBOARD_ROUTES]
        ?.path;
      if (target) {
        router.replace(target);
      }
    }
  }, [session, role, router]);

  return null;
}
