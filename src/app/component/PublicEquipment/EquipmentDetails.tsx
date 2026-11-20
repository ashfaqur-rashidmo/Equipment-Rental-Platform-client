
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Boxes,
  Clock,
  Mail,
  MapPin,
  Package,
  ScrollText,
  Tag,
  User,
} from "lucide-react";
import { EquipmentItem } from "@/data/equipment";
import AddFavoriteButton from "./AddFavoriteButton";
import BookEquipmentModal from "./BookEquipmentModal";

interface EquipmentDetailsProps {
  equipment: EquipmentItem;
}

/**
 * Reusable detail view for a single equipment item.
 * Everything it needs comes from the `equipment` prop.
 */
const EquipmentDetails = ({ equipment }: EquipmentDetailsProps) => {
  const price = Number(equipment.rentalPrice).toLocaleString("en-BD");
  const isAvailable = equipment.availableQuantity > 0;
  const hasImage = Boolean(equipment.image?.trim());
  const equipmentId = equipment._id || equipment.id || "";

  /** Label + value pairs shown in the summary card. */
  const specs = [
    { icon: Tag, label: "Category", value: equipment.category || "N/A" },
    {
      icon: Clock,
      label: "Rental Type",
      value: equipment.rentalType || "N/A",
    },
    {
      icon: MapPin,
      label: "Location",
      value: equipment.location || "N/A",
    },
    {
      icon: Boxes,
      label: "Available Quantity",
      value: `${equipment.availableQuantity ?? 0} units`,
    },
  ];

  return (
    <main className="min-h-screen bg-base-200">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-base-content/60">
          <Link
            href="/all-equipment"
            className="link link-primary flex items-center gap-1"
          >
            <ArrowLeft size={15} />
            All Equipment
          </Link>

          <span>/</span>

          <span className="truncate text-base-content">
            {equipment.name}
          </span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">

          {/* Left: image, description, terms */}
          <div className="space-y-6">

            {/* Equipment Image */}
            <figure className="relative h-64 w-full overflow-hidden rounded-box border border-base-300 bg-base-100 sm:h-96">
              {hasImage ? (
                <Image
                  src={equipment.image as string}
                  alt={equipment.name}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package size={56} className="text-base-content/30" />
                </div>
              )}

              {/* Badges */}
              <div className="absolute left-4 top-4 flex gap-2">
                <span
                  className={`badge ${
                    isAvailable ? "badge-success" : "badge-error"
                  }`}
                >
                  {isAvailable ? "Available" : "Unavailable"}
                </span>

                <span className="badge badge-neutral">
                  {equipment.category}
                </span>
              </div>
            </figure>

            {/* Description */}
            <section className="rounded-box border border-base-300 bg-base-100 p-6">
              <h2 className="mb-3 text-lg font-bold">Description</h2>
              <p className="text-sm leading-relaxed text-base-content/70">
                {equipment.description || "No description provided."}
              </p>
            </section>

            {/* Rental Terms and Conditions */}
            <section className="rounded-box border border-base-300 bg-base-100 p-6">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <ScrollText size={18} className="text-primary" />
                Rental Terms and Conditions
              </h2>

              <p className="text-sm leading-relaxed text-base-content/70">
                {equipment.terms || "No terms provided. Contact the owner before booking."}
              </p>
            </section>
          </div>

          {/* Right: summary + owner */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">

            {/* Key information */}
            <div className="rounded-box border border-base-300 bg-base-100 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {equipment.category}
              </p>

              <h1 className="mt-1 text-2xl font-bold">
                {equipment.name}
              </h1>

              {/* Rental Price */}
              <p className="mt-4">
                <span className="text-3xl font-bold text-primary">
                  ৳{price}
                </span>
                <span className="ml-1 text-sm text-base-content/50">
                  / {equipment.rentalType || "rental"}
                </span>
              </p>

              {/* Specs */}
              <dl className="mt-6 space-y-3 border-t border-base-300 pt-4">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 text-sm">
                    <Icon size={16} className="mt-0.5 shrink-0 text-primary" />

                    <dt className="text-base-content/60">{label}</dt>

                    <dd className="ml-auto text-right font-medium">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Book + Favorite */}
            <div className="space-y-3 rounded-box border border-base-300 bg-base-100 p-6">
              <BookEquipmentModal
                equipmentId={equipmentId}
                equipmentName={equipment.name}
                rentalPrice={Number(equipment.rentalPrice) || 0}
                rentalType={equipment.rentalType}
              />

              <AddFavoriteButton equipmentId={equipmentId} />
            </div>

            {/* Owner Information */}
            <div className="rounded-box border border-base-300 bg-base-100 p-6">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-base-content/60">
                Owner Information
              </h2>

              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                  <User size={20} className="text-primary" />
                </span>

                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {equipment.ownerName || "Equipment Owner"}
                  </p>

                  {equipment.ownerEmail && (
                    <a
                      href={`mailto:${equipment.ownerEmail}`}
                      className="flex items-center gap-1 truncate text-sm text-base-content/60 link link-hover"
                    >
                      <Mail size={13} />
                      {equipment.ownerEmail}
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              {equipment.ownerEmail && (
                <a
                  href={`mailto:${equipment.ownerEmail}`}
                  className="btn btn-primary mt-5 w-full"
                >
                  <Mail size={16} />
                  Contact Owner
                </a>
              )}

              <Link
                href="/all-equipment"
                className="btn btn-outline mt-2 w-full"
              >
                <ArrowLeft size={16} />
                Back to All Equipment
              </Link>
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
};

export default EquipmentDetails;
