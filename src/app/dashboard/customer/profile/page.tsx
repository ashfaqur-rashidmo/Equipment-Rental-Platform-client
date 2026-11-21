"use client";

import React, { useEffect, useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, Image as ImageIcon, Save, Edit } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [formData, setFormData] = useState(() => ({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    image: user?.image || null,
  }));
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Upload the picked image to ImgBB and return the hosted URL.
  const uploadImage = async (file: File): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("ImgBB API key is missing.");
    }

    const form = new FormData();
    form.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      { method: "POST", body: form }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error?.message || "Image upload failed.");
    }

    return data.data.url;
  };

  // Pick a new profile image: upload it to ImgBB, then preview the hosted
  // URL so it is included when the user saves.
  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);

      const uploadedUrl = await uploadImage(file);

      setFormData((prev) => ({ ...prev, image: uploadedUrl }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload error:", error);

      toast.error(
        error instanceof Error ? error.message : "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  // Keep the form in sync with the session user when the session arrives
  // and the user is not mid-edit.
  useEffect(() => {
    if (!user || isEditing) return;

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      image: user.image || null,
    });
  }, [user, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        image: formData.image || undefined,
      });

      if (error) {
        throw new Error(error.message || "Failed to update profile.");
      }

      toast.success("Profile updated successfully.");
      setIsEditing(false);
    } catch (err) {
      console.error("Update profile error:", err);

      toast.error(
        err instanceof Error ? err.message : "Failed to update profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const avatarUrl = formData.image || user?.image;

  return (
    <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Profile</h1>
          <p className="text-sm text-base-content/60">
            Manage your personal information
          </p>
        </div>
        <Link
          href="/dashboard"
          className="btn btn-outline btn-sm"
        >
          <span>Back to My Rentals</span>
        </Link>
      </div>

      {user && (
        <div className="mb-4 flex items-center gap-2 text-sm text-base-content/70">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-base-200 text-base-content">
            {user.name?.charAt(0).toUpperCase() || "C"}
          </div>
          <span>Logged in as {user.name}</span>
        </div>
      )}

      <div className="rounded-box border border-base-300 bg-base-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile image section */}
          <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
            <div className="relative h-32 w-32 shrink-0 rounded-full overflow-hidden border border-base-300 bg-base-200">
              {avatarUrl ? (
                <img
                  // eslint-disable-next-line @next/next/no-img-element
                  src={avatarUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-base-200 text-base-content/40">
                  <ImageIcon className="h-10 w-10" />
                </div>
              )}
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/60 transition-colors cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (file.type && !file.type.startsWith("image/")) {
                        toast.error("Please select a valid image.");
                        return;
                      }

                      if (file.size > 5 * 1024 * 1024) {
                        toast.error("Image size must be less than 5MB.");
                        return;
                      }

                      handleImageUpload(file);
                    }}
                  />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-content group-hover:scale-110 transition-transform">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-base-content">
                      Change photo
                    </span>
                  </div>
                </label>
              )}
            </div>
            {!isEditing && (
              <p className="text-xs text-base-content/50 text-center">
                Profile picture
              </p>
            )}
          </div>

          {/* Profile form */}
          <div className="flex-1 space-y-4">
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="label pb-1">
                    <span className="label-text font-medium">
                      <User className="mr-2 h-4 w-4 inline shrink-0" />
                      Full Name
                    </span>
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-bordered"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="label pb-1">
                    <span className="label-text font-medium">
                      <Mail className="mr-2 h-4 w-4 inline shrink-0" />
                      Email
                    </span>
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    className="input-bordered"
                    placeholder="you@example.com"
                  />
                  <Badge variant="outline" className="mt-1">
                    Verified
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <label className="label pb-1">
                  <span className="label-text font-medium">
                    <Phone className="mr-2 h-4 w-4 inline shrink-0" />
                    Phone Number
                  </span>
                </label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input-bordered"
                  placeholder="+880 1xxx-xxxxxx"
                />
              </div>

              <div className="space-y-2">
                <label className="label pb-1">
                  <span className="label-text font-medium">
                    <MapPin className="mr-2 h-4 w-4 inline shrink-0" />
                    Address
                  </span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={cn(
                    "input input-bordered h-auto min-h-[80px] resize-y",
                    !isEditing && "bg-base-200/50 cursor-not-allowed"
                  )}
                  placeholder="Enter your address"
                />
              </div>

              {isEditing ? (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn btn-primary"
                  >
                    {isSaving ? (
                      <>
                        <Save className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="btn btn-outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Read-only info preview when not editing */}
        {!isEditing && (
          <div className="mt-8 border-t border-base-300 pt-6">
            <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wider mb-4">
              Account Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-base-content/40" />
                <span className="font-medium">Email:</span>
                <span className="text-base-content/60 ml-auto">{formData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-base-content/40" />
                <span className="font-medium">Phone:</span>
                <span className="text-base-content/60 ml-auto">{formData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 shrink-0 text-base-content/40" />
                <span className="font-medium">Address:</span>
                <span className="text-base-content/60 ml-auto max-w-none">
                  {formData.address}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
