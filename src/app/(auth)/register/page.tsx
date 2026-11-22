
"use client";

import {
  BadgeCheck,
  CalendarClock,
  CircleDashed,
  ImagePlus,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";


type SignUpRole = "Customer" | "Owner" | "Admin";

const passwordRules = [
  "At least 6 characters",
  "One uppercase letter (A–Z)",
  "One lowercase letter (a–z)",
];

const perks = [
  { icon: BadgeCheck, text: "Verified owners & maintained equipment" },
  { icon: CalendarClock, text: "Flexible daily, weekly and monthly rentals" },
  { icon: ShieldCheck, text: "Secure payments powered by Stripe" },
];

export default function RegisterPage() {
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<SignUpRole>("Customer");

  // Upload image to ImgBB
  const uploadImage = async (imageFile: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("ImgBB API key is missing.");
    }

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error?.message || "Image upload failed.");
    }

    return data.data.url;
  };

  // Handle image upload
  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const uploadedUrl = await uploadImage(file);

      setImageUrl(uploadedUrl);

      toast.success("Profile image uploaded successfully.");
    } catch (error) {
      console.error("Image upload error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      );
    } finally {
      setUploading(false);
    }
  };

  // Handle direct image URL
  const handleImageUrlChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setImageUrl(e.target.value);
  };

  // Handle registration
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const password = formData.get("password")?.toString() || "";
    const confirmPassword =
      formData.get("confirmPassword")?.toString() || "";

    // Check required fields
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Password validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain at least one lowercase letter.");
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (uploading) {
      toast.error("Please wait until your image upload finishes.");
      return;
    }

    // Validate direct image URL if provided
    if (imageUrl.trim()) {
      try {
        const parsedUrl = new URL(imageUrl.trim());

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          toast.error("Please provide a valid image URL.");
          return;
        }
      } catch {
        toast.error("Please provide a valid image URL.");
        return;
      }
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: imageUrl.trim() || undefined,
        role,
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Account created successfully!");

      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-base-300 bg-base-100 shadow-xl lg:grid-cols-2">

      {/* Left brand panel */}
      <div className="relative hidden lg:block">
        <Image
          src="/images/equipment/hero.jpg"
          alt="Construction crew using rented equipment"
          fill
          priority
          sizes="(max-width: 1024px) 0px, 50vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-neutral/95 via-neutral/70 to-primary/30" />

        <div className="relative flex h-full flex-col justify-between p-10 text-neutral-content">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Join EquipRent
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-snug">
              Start renting in minutes — or earn from your idle equipment.
            </h2>
          </div>

          <ul className="space-y-4">
            {perks.map((perk) => (
              <li key={perk.text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                  <perk.icon
                    className="h-4.5 w-4.5 text-primary"
                    aria-hidden
                  />
                </span>

                <span className="text-sm text-neutral-content/90">
                  {perk.text}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-xs text-neutral-content/60">
            Your equipment rental marketplace.
          </p>
        </div>
      </div>

      {/* Registration form */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col justify-center p-6 sm:p-10 lg:p-12"
      >
        <div className="mx-auto w-full max-w-md">

          <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary lg:hidden">
            <ImagePlus className="h-6 w-6" aria-hidden />
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-base-content">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-base-content/60">
            Join EquipRent and get the equipment you need for your projects.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>

            {/* Name */}
            <div>
              <label htmlFor="name" className="label pb-1">
                <span className="label-text font-medium">Full Name</span>
              </label>

              <label className="input input-bordered flex w-full items-center gap-2 focus-within:outline-primary">
                <User className="h-4 w-4 shrink-0 text-base-content/40" />

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  className="grow"
                  autoComplete="name"
                  required
                />
              </label>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="label pb-1">
                <span className="label-text font-medium">Email</span>
              </label>

              <label className="input input-bordered flex w-full items-center gap-2 focus-within:outline-primary">
                <Mail className="h-4 w-4 shrink-0 text-base-content/40" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="grow"
                  autoComplete="email"
                  required
                />
              </label>
            </div>


{/* Account Type */}
<div>
  <label htmlFor="role" className="label pb-1">
    <span className="label-text font-medium">
      Select Account Type
    </span>
  </label>

  <select
    id="role"
    value={role}
    onChange={(e) => setRole(e.target.value as SignUpRole)}
    className="select select-bordered w-full"
  >
    <option value="Customer">Customer - Rent equipment</option>
    <option value="Owner">Equipment Owner - Rent out equipment</option>
    <option value="Admin">Admin - Manage platform</option>
  </select>
</div>


            {/* Profile Photo: Direct URL */}
            <div>
              <label htmlFor="imageUrl" className="label pb-1">
                <span className="label-text font-medium">
                  Photo URL (Optional)
                </span>
              </label>

              <label className="input input-bordered flex w-full items-center gap-2 focus-within:outline-primary">
                <ImagePlus className="h-4 w-4 shrink-0 text-base-content/40" />

                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className="grow"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                />
              </label>

              {/* ImgBB Upload */}
              <div className="mt-3">
                <label htmlFor="photo" className="label pb-1">
                  <span className="label-text text-xs text-base-content/60">
                    Or upload a photo using ImgBB
                  </span>
                </label>

                <input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input file-input-bordered w-full"
                />
              </div>

              {uploading && (
                <p className="mt-2 text-xs text-primary">
                  Uploading image...
                </p>
              )}

              {imageUrl && (
                <p className="mt-2 break-all text-xs text-success">
                  Profile photo is ready.
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label pb-1">
                <span className="label-text font-medium">Password</span>
              </label>

              <label className="input input-bordered flex w-full items-center gap-2 focus-within:outline-primary">
                <Lock className="h-4 w-4 shrink-0 text-base-content/40" />

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="grow"
                  autoComplete="new-password"
                  required
                />
              </label>

              <ul className="mt-3 grid gap-1.5 sm:grid-cols-3">
                {passwordRules.map((rule) => (
                  <li
                    key={rule}
                    className="flex items-center gap-1.5 rounded-lg bg-base-200 px-2 py-1.5 text-xs text-base-content/60"
                  >
                    <CircleDashed className="h-3.5 w-3.5 shrink-0 text-base-content/40" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="label pb-1">
                <span className="label-text font-medium">
                  Confirm Password
                </span>
              </label>

              <label className="input input-bordered flex w-full items-center gap-2 focus-within:outline-primary">
                <Lock className="h-4 w-4 shrink-0 text-base-content/40" />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="grow"
                  autoComplete="new-password"
                  required
                />
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || uploading}
              className="btn btn-primary btn-block mt-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-base-content/60">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary link-hover"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
