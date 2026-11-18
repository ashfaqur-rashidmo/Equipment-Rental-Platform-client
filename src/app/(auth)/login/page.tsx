"use client";

import { GoogleLogo } from "@/components/brand-icons";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const HandleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const collectedForm = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

   setIsLoading(true);

   try {
     await authClient.signIn.email({
       email: collectedForm.email,
       password: collectedForm.password,
     });
   }
    catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setIsLoading(false);
    }
    
    // Reset the form after submission
    form.reset();

  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-xl sm:p-10"
    >
      <h1 className="text-3xl font-bold tracking-tight text-base-content">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-base-content/60">
        Login to book equipment, manage rentals and your dashboard.
      </p>

      {/* UI only — no auth logic wired yet */}
      <form className="mt-8 space-y-4" onSubmit={HandleSignIn}>
        <div>
          <label htmlFor="login-email" className="label pb-1">
            <span className="label-text font-medium">Email</span>
          </label>
          <label className="input input-bordered flex w-full items-center gap-2 focus-within:outline-primary">
            <Mail className="h-4 w-4 shrink-0 text-base-content/40" aria-hidden />
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="grow"
              autoComplete="email"
            />
          </label>
        </div>

        <div>
          <label htmlFor="login-password" className="label pb-1">
            <span className="label-text font-medium">Password</span>
          </label>
          <label className="input input-bordered flex w-full items-center gap-2 focus-within:outline-primary">
            <Lock className="h-4 w-4 shrink-0 text-base-content/40" aria-hidden />
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="grow"
              autoComplete="current-password"
            />
          </label>
        </div>

        <button type="submit" className="btn btn-primary btn-block mt-2">
          Login
        </button>

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-base-300" />
          <span className="text-xs uppercase tracking-wider text-base-content/50">
            or
          </span>
          <span className="h-px flex-1 bg-base-300" />
        </div>

        <button type="button" className="btn btn-outline btn-block gap-2">
          <GoogleLogo className="h-5 w-5" />
          Continue with Google
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-base-content/60">
        New to EquipRent?{" "}
        <Link href="/register" className="font-semibold text-primary link-hover">
          Create an account
        </Link>
      </p>
    </motion.div>
  );
}
