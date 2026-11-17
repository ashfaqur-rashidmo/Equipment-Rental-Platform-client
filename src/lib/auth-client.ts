"use client";

import { useEffect, useState } from "react";

export type UserRole = "customer" | "owner" | "admin";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
}

export interface Session {
  user: SessionUser;
  session: {
    id: string;
    expiresAt: string;
  };
}

export interface SessionResult {
  data: Session | null;
  isPending: boolean;
  error: unknown;
}

/**
 * Temporary stub while the Express + BetterAuth backend is not wired up yet.
 * Deliberately matches the shape of `authClient.useSession()` from
 * `better-auth/react` so the swap is a body-only change — no call sites
 * should change. Auth state must always come from this hook.
 */
export function useSession(): SessionResult {
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsPending(false), 0);
    return () => clearTimeout(timer);
  }, []);

  return { data: null, isPending, error: null };
}

/** Signs the user out. Swapped together with the real auth client. */
export async function signOut(): Promise<void> {
  // Real implementation: await authClient.signOut()
}
