
"use client";

import React, { useState } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Upload, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CategorySelect from "@/app/component/ownerEquipments/CategorySelect";

const rentalTypes = ["Daily", "Weekly", "Monthly"];
const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

export default function AddEquipmentPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const router = useRouter();

  const [imageUrl, setImageUrl] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
    rentalPrice: "",
    rentalType: "Daily",
    availableQuantity: "",
    condition: "",
    brand: "",
    model: "",
    image: "",
    terms: "",
    status: "Pending",
  });

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload from device
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      input.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      input.value = "";
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      toast.error("ImgBB API key is missing.");
      input.value = "";
      return;
    }

    setUploading(true);

    try {
      const imageData = new FormData();
      imageData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: imageData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error?.message || "Image upload failed."
        );
      }

      const uploadedImageUrl = result.data.url;

      setImageUrl(uploadedImageUrl);
      setImageLink("");

      setFormData((prev) => ({
        ...prev,
        image: uploadedImageUrl,
      }));

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Image upload failed."
      );
    } finally {
      setUploading(false);
      input.value = "";
    }
  };

  // Handle image URL
  const handleImageLink = () => {
  const url = imageLink.trim();

  if (!url) {
    toast.error("Please enter an image URL.");
    return;
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
      toast.error("Please enter a valid image URL.");
      return;
    }

    // Update both states
    setImageUrl(url);

    setFormData((prev) => ({
      ...prev,
      image: url,
    }));

    toast.success("Image URL added successfully!");
  } catch {
    toast.error("Please enter a valid image URL.");
  }
};

  // Handle invalid image preview
  const handleImageError = () => {
    setImageUrl("");
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));

    toast.error("Unable to load this image. Please try another URL.");
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageUrl("");
    setImageLink("");

    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  // Submit equipment
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login before listing equipment.");
      return;
    }

    // Sync formData.image with current imageUrl state
    setFormData((prev) => ({ ...prev, image: imageUrl }));

    if (!imageUrl) {
      toast.error("Please add an equipment image.");
      return;
    }

    if (!formData.terms.trim()) {
      toast.error("Please enter rental terms and conditions.");
      return;
    }

    const availableQuantity = Number(formData.availableQuantity);

    if (
      !Number.isInteger(availableQuantity) ||
      availableQuantity < 1
    ) {
      toast.error("Available quantity must be at least 1.");
      return;
    }

    setIsSaving(true);

    try {
      const equipmentData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        location: formData.location.trim(),
        rentalPrice: Number(formData.rentalPrice),
        rentalType: formData.rentalType,
        availableQuantity,
        condition: formData.condition,
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        image: formData.image,
        terms: formData.terms.trim(),
        status: "Pending",

        // The backend must verify these against the authenticated user.
        ownerId: user.id,
        ownerName: user.name,
        ownerEmail: user.email,
      };

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!API_BASE_URL) {
        toast.error("API base URL is not configured.");
        setIsSaving(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/add-equipment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.session?.token
            ? { Authorization: `Bearer ${session.session.token}` }
            : {}),
        },
        body: JSON.stringify(equipmentData),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to list equipment."
        );
      }

      toast.success("Equipment listed successfully!");

      router.push("/dashboard/owner/my-equipment");
      router.refresh();
    } catch (error) {
      console.error("Equipment submission error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Add Equipment
          </h1>

          <p className="text-sm text-base-content/60">
            List your equipment for rent on EquipRent
          </p>
        </div>

        <Link
          href="/dashboard/owner/my-equipment"
          className="btn btn-outline btn-sm flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Equipment
        </Link>
      </div>

      {/* Logged-in Owner */}
      {user && (
        <div className="mb-4 flex items-center gap-2 text-sm text-base-content/70">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-base-200 text-base-content">
            {user.name?.charAt(0).toUpperCase() || "O"}
          </div>

          <span>Logged in as {user.name}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">

          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-base-content/70">
            Equipment Details
          </h3>

          {/* Equipment Information */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Equipment Name */}
            <div className="space-y-2">
              <label className="label pb-1">
                <span className="label-text font-medium">
                  Equipment Name
                </span>
              </label>

              <Input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Excavator CAT 320"
                className="input-bordered"
                required
              />
            </div>

            {/* Category */}
           <CategorySelect
  value={formData.category}
  onChange={(value) =>
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }
/>

            {/* Brand */}
            <div className="space-y-2">
              <label className="label pb-1">
                <span className="label-text font-medium">Brand</span>
              </label>

              <Input
                name="brand"
                type="text"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Caterpillar"
                className="input-bordered"
              />
            </div>

            {/* Model */}
            <div className="space-y-2">
              <label className="label pb-1">
                <span className="label-text font-medium">Model</span>
              </label>

              <Input
                name="model"
                type="text"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. 320"
                className="input-bordered"
              />
            </div>

            {/* Rental Price */}
            <div className="space-y-2">
              <label className="label pb-1">
                <span className="label-text font-medium">
                  Rental Price
                </span>
              </label>

              <div className="flex items-center gap-2">
                <Input
                  name="rentalPrice"
                  type="number"
                  min="1"
                  value={formData.rentalPrice}
                  onChange={handleChange}
                  placeholder="0"
                  className="input-bordered"
                  required
                />

                <span className="text-base-content/60">/day</span>
              </div>
            </div>

            {/* Rental Type */}
            <div className="space-y-2">
              <label className="label pb-1">
                <span className="label-text font-medium">
                  Rental Type
                </span>
              </label>

              <select
                name="rentalType"
                value={formData.rentalType}
                onChange={handleChange}
                className="select select-bordered h-8 w-full rounded-lg border-border bg-transparent"
              >
                {rentalTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Available Quantity */}
            <div className="space-y-2">
              <label className="label pb-1">
                <span className="label-text font-medium">
                  Available Quantity
                </span>
              </label>

              <Input
                name="availableQuantity"
                type="number"
                min="1"
                step="1"
                value={formData.availableQuantity}
                onChange={handleChange}
                placeholder="1"
                className="input-bordered"
                required
              />
            </div>

            {/* Equipment Condition */}
            <div className="space-y-2">
              <label className="label pb-1">
                <span className="label-text font-medium">
                  Equipment Condition
                </span>
              </label>

              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className={`select select-bordered h-8 w-full rounded-lg border-border bg-transparent ${
                  !formData.condition ? "text-base-content/40" : ""
                }`}
                required
              >
                <option value="" disabled>
                  Select condition
                </option>

                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="label pb-1">
                <span className="label-text font-medium">Location</span>
              </label>

              <Input
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Dhaka, Bangladesh"
                className="input-bordered"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 space-y-2">
            <label className="label pb-1">
              <span className="label-text font-medium">Description</span>
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered h-32 w-full rounded-lg border-border bg-transparent"
              placeholder="Describe your equipment..."
              required
            />
          </div>

          {/* Equipment Image */}
          <div className="mt-6 space-y-4">

            <label className="label pb-1">
              <span className="label-text font-medium">
                Equipment Image
              </span>
            </label>

            {/* Add Image URL */}
            <div className="flex flex-col gap-2 sm:flex-row">
             <Input
  type="url"
  value={imageLink}
  onChange={(e) => setImageLink(e.target.value)}
  placeholder="Paste equipment image URL..."
  className="input-bordered flex-1"
/>

              <button
                type="button"
                onClick={handleImageLink}
                className="btn btn-outline"
                disabled={uploading}
              >
                Add Image Link
              </button>
            </div>

            {/* Image Preview and Device Upload */}
            <div className="flex flex-wrap items-center gap-4">

              <div className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-base-300 bg-base-200">

                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt="Equipment preview"
                    className="h-full w-full object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-base-content/40">
                    <Upload className="h-6 w-6" />
                    <span className="text-xs">No image</span>
                  </div>
                )}

                {/* Upload from Device */}
                <label className="group absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-colors hover:bg-black/60 group-hover:opacity-100">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />

                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-content">
                      <Upload className="h-3 w-3" />
                    </div>

                    <span className="text-xs font-medium text-white">
                      Change photo
                    </span>
                  </div>
                </label>
              </div>

              {uploading && (
                <span className="text-xs text-primary">
                  Uploading image...
                </span>
              )}

              {imageUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="btn btn-ghost btn-sm text-error"
                >
                  Remove Image
                </button>
              )}
            </div>

            <p className="text-xs text-base-content/50">
              Upload from your device (JPG, PNG up to 5MB) or paste an image URL.
            </p>
          </div>

          {/* Rental Terms and Conditions */}
          <div className="mt-6 space-y-2">
            <label className="label pb-1">
              <span className="label-text font-medium">
                Rental Terms and Conditions
              </span>
            </label>

            <textarea
              name="terms"
              value={formData.terms}
              onChange={handleChange}
              className="textarea textarea-bordered min-h-32 w-full rounded-lg border-border bg-transparent"
              placeholder="Enter rental terms and conditions..."
              required
            />
          </div>

          {/* Status */}
          <div className="mt-6 space-y-2">
            <label className="label pb-1">
              <span className="label-text font-medium">Status</span>
            </label>

            <div className="flex items-center gap-2">
              <Badge variant="outline">{formData.status}</Badge>

              <span className="text-xs text-base-content/50">
                Equipment will be listed as pending until approved by admin.
              </span>
            </div>
          </div>

          {/* Owner Information */}
          <div className="mt-4 space-y-2 border-t border-base-300 pt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-base-content/70">
              Owner Information
            </h4>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-base-content">Name:</span>
                <span className="text-base-content/60">
                  {user?.name || "Owner"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-base-content">Email:</span>
                <span className="text-base-content/60">
                  {user?.email || ""}
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-3 pt-4">

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/owner/my-equipment")
            }
            className="btn btn-ghost"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving || uploading}
            className="btn btn-primary"
          >
            {isSaving ? (
              <>
                <Save className="mr-2 h-4 w-4 animate-spin" />
                Listing...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                List Equipment
              </>
            )}
          </button>

        </div>
      </form>

      <div className="mt-4 text-xs text-base-content/50">
        <p>
          <strong>Note:</strong> Equipment listing requires a working backend
          endpoint and database connection.
        </p>
      </div>

    </div>
  );
}
