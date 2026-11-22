"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

/**
 * Signs out and sends the user to the login page — they don't stay on a
 * private page while logged out.
 */
export function useLogOut() {
  const router = useRouter();

  return async () => {
    await signOut();
    router.push("/login");
  };
}
