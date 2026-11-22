
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import CategorySelect from "@/app/component/ownerEquipments/CategorySelect";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const RENTAL_TYPES = ["Daily", "Weekly", "Monthly"] as const;
const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"] as const;

type RentalType = (typeof RENTAL_TYPES)[number];
type Condition = (typeof CONDITIONS)[number];

/**
 * Stored values are capitalized; older rows may hold lowercase ones, so
 * normalize whatever the API returns into the canonical form.
 */
const normalizeRentalType = (value: string | undefined): RentalType => {
  const found = RENTAL_TYPES.find(
    (type) => type.toLowerCase() === (value || "").trim().toLowerCase()
  );
  return found || "Daily";
};

const normalizeCondition = (value: string | undefined): Condition => {
  const found = CONDITIONS.find(
    (condition) =>
      condition.toLowerCase() === (value || "").trim().toLowerCase()
  );
  return found || "Good";
};

interface EquipmentFormData {
  name: string;
  description: string;
  category: string;
  rentalPrice: number;
  rentalType: RentalType;
  location: string;
  availableQuantity: number;
  condition: Condition;
  brand: string;
  model: string;
  image: string;
  terms: string;
}

interface EquipmentRecord extends EquipmentFormData {
  _id?: string;
  id?: string;
}

const EditEquipmentPage = () => {
  const params = useParams<{ id: string }>();
  const equipmentId = params.id;

  const router = useRouter();

  const { data: session } = useSession();
  const token = session?.session?.token;

  const [formData, setFormData] = useState<EquipmentFormData>({
    name: "",
    description: "",
    category: "",
    rentalPrice: 0,
    rentalType: "Daily",
    location: "",
    availableQuantity: 1,
    condition: "New",
    brand: "",
    model: "",
    image: "",
    terms: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch existing equipment
  useEffect(() => {
    const controller = new AbortController();

    const fetchEquipment = async () => {
      try {
        if (!API_BASE_URL) {
          throw new Error("API URL is not configured.");
        }

        const response = await fetch(
          `${API_BASE_URL}/equipment`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch equipment.");
        }

        const equipmentList: EquipmentRecord[] = await response.json();

        const selectedEquipment = equipmentList.find(
          (item) =>
            item._id === equipmentId || item.id === equipmentId
        );

        if (!selectedEquipment) {
          throw new Error("Equipment not found.");
        }

        setFormData({
          name: selectedEquipment.name || "",
          description: selectedEquipment.description || "",
          category: selectedEquipment.category || "",
          rentalPrice: selectedEquipment.rentalPrice || 0,
          rentalType: normalizeRentalType(selectedEquipment.rentalType),
          location: selectedEquipment.location || "",
          availableQuantity: selectedEquipment.availableQuantity || 1,
          condition: normalizeCondition(selectedEquipment.condition),
          brand: selectedEquipment.brand || "",
          model: selectedEquipment.model || "",
          image: selectedEquipment.image || "",
          terms: selectedEquipment.terms || "",
        });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Fetch equipment error:", error);
        toast.error(
          error instanceof Error ? error.message : "Something went wrong."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void (async () => {
      await fetchEquipment();
    })();

    return () => controller.abort();
  }, [equipmentId]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "rentalPrice" || name === "availableQuantity"
          ? Number(value)
          : value,
    }));
  };

  // Update equipment
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!API_BASE_URL) {
        throw new Error("API URL is not configured.");
      }

      if (formData.rentalPrice <= 0) {
        toast.error("Rental price must be greater than 0.");
        return;
      }

      if (formData.availableQuantity < 1) {
        toast.error("Quantity must be at least 1.");
        return;
      }

      setUpdating(true);

      const response = await fetch(
        `${API_BASE_URL}/equipment/${equipmentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update equipment.");
      }

      toast.success("Equipment updated successfully!");

      router.push("/dashboard/owner/my-equipment");
      router.refresh();
    } catch (error) {
      console.error("Update equipment error:", error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Edit Equipment
          </h1>

          <p className="mt-1 text-sm text-base-content/60">
            Update your equipment information.
          </p>
        </div>

        <Link
          href="/dashboard/owner/my-equipment"
          className="btn btn-outline btn-sm"
        >
          <ArrowLeft size={16} />
          Back to My Equipment
        </Link>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-box border border-base-300 bg-base-100 p-5 shadow-sm sm:p-8"
      >

        {/* Basic Information */}
        <div>
          <h2 className="mb-5 text-lg font-semibold">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Equipment Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Brand</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Model</span>
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            {/* <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Category</span>
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div> */}

            <CategorySelect
  value={formData.category}
  onChange={(value) =>
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }
/>

            <div className="form-control sm:col-span-2">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="textarea textarea-bordered min-h-28 w-full"
                required
              />
            </div>

          </div>
        </div>

        <div className="divider" />

        {/* Rental Information */}
        <div>
          <h2 className="mb-5 text-lg font-semibold">
            Rental Information
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Rental Price</span>
              </label>
              <input
                type="number"
                name="rentalPrice"
                value={formData.rentalPrice}
                onChange={handleChange}
                className="input input-bordered w-full"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Rental Type</span>
              </label>
              <select
                name="rentalType"
                value={formData.rentalType}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                {RENTAL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Available Quantity
                </span>
              </label>
              <input
                type="number"
                name="availableQuantity"
                value={formData.availableQuantity}
                onChange={handleChange}
                className="input input-bordered w-full"
                min="1"
                step="1"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Condition</span>
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                {CONDITIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control sm:col-span-2">
              <label className="label">
                <span className="label-text font-medium">Location</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

          </div>
        </div>

        <div className="divider" />

        {/* Image and Terms */}
        <div>
          <h2 className="mb-5 text-lg font-semibold">
            Additional Information
          </h2>

          <div className="space-y-5">

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Image URL</span>
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="https://example.com/image.jpg"
              />

              {formData.image && (
                <div className="mt-3">
                  <img
                    src={formData.image}
                    alt="Equipment preview"
                    className="h-40 w-40 rounded-lg border border-base-300 object-cover"
                  />
                </div>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Rental Terms</span>
              </label>
              <textarea
                name="terms"
                value={formData.terms}
                onChange={handleChange}
                className="textarea textarea-bordered min-h-28 w-full"
                placeholder="Enter rental terms and conditions..."
              />
            </div>

          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col-reverse justify-end gap-3 border-t border-base-300 pt-6 sm:flex-row">

          <Link
            href="/dashboard/owner/my-equipment"
            className="btn btn-ghost"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={updating}
            className="btn btn-primary"
          >
            {updating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save size={18} />
                Update Equipment
              </>
            )}
          </button>

        </div>

      </form>
    </div>
  );
};

export default EditEquipmentPage;
