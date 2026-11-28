"use client";

import { GoogleLogo } from "@/components/brand-icons";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirectTo");
  const isSafeRedirect =
    rawRedirect !== null &&
    rawRedirect.startsWith("/") &&
    !rawRedirect.startsWith("//");
  const redirectTo = isSafeRedirect && rawRedirect ? rawRedirect : "/";
  const emailVerified = searchParams.get("verified") === "1";

  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);

  const router = useRouter();

const HandleSignIn = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  const form = e.currentTarget;
  const formData = new FormData(form);

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  setLoginEmail(email);
  setNeedsVerification(false);

  if (!email || !password) {
    toast.error("Please enter your email and password.");
    return;
  }

  setIsLoading(true);

  try {
    // Navigation is handled explicitly below — no callbackURL here, otherwise
    // BetterAuth would redirect to it ("/") and race the role-based push.
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
    });

    if (error) {
      const message = error.message || "Login failed.";

      if (
        error.code === "EMAIL_NOT_VERIFIED" ||
        /verif/i.test(message)
      ) {
        setNeedsVerification(true);
        toast.error(
          "Your email is not verified yet. Check your inbox or resend the link below."
        );
      } else {
        toast.error(message);
      }
      return;
    }

    toast.success("Login successful!");

    // Go back to where the login started (e.g. the booking form),
    // otherwise land on the role's dashboard.
    if (isSafeRedirect && redirectTo !== "/") {
      router.push(redirectTo);
      return;
    }

    const role = data.user.role;

    if (role === "Admin") {
      router.push("/dashboard/admin");
    } else if (role === "Owner") {
      router.push("/dashboard/owner");
    } else {
      router.push("/dashboard/customer");
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

// Send a fresh verification link to the email typed in the form.
const handleResendVerification = async () => {
  if (!loginEmail) {
    toast.error("Enter your email above first.");
    return;
  }

  setResending(true);
  try {
    const { error } = await authClient.sendVerificationEmail({
      email: loginEmail,
      callbackURL: "/login?verified=1",
    });

    if (error) {
      toast.error(error.message || "Could not resend the verification email.");
    } else {
      toast.success("Verification email sent. Check your inbox.");
    }
  } catch (error) {
    console.error("Resend verification error:", error);
    toast.error("Could not resend the verification email.");
  } finally {
    setResending(false);
  }
};

const handleGoogleSignIn = async () => {
  try {
    setIsLoading(true);

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: isSafeRedirect ? redirectTo : "/dashboard/customer",
    });

    if (error) {
      toast.error(error.message || "Google login failed.");
      return;
    }
  } catch (error) {
    console.error("Google login error:", error);
    toast.error("Something went wrong with Google login. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

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

      {(emailVerified || needsVerification) && (
        <div className="mt-4 rounded-box border border-success/30 bg-success/10 p-3 text-sm text-success">
          {emailVerified
            ? "Email verified. You can log in now."
            : "Email not verified yet. Use the button below if you can't find the link."}
        </div>
      )}

      {/* Email + password login */}
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

        <button
  type="submit"
  disabled={isLoading}
  className="btn btn-primary btn-block mt-2"
>
  {isLoading ? "Logging in..." : "Login"}
</button>

        {(emailVerified || needsVerification) && (
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={resending}
            className="btn btn-ghost btn-sm text-primary"
          >
            {resending ? "Sending..." : "Resend verification email"}
          </button>
        )}

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-base-300" />
          <span className="text-xs uppercase tracking-wider text-base-content/50">
            or
          </span>
          <span className="h-px flex-1 bg-base-300" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="btn btn-outline btn-block gap-2"
        >
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
