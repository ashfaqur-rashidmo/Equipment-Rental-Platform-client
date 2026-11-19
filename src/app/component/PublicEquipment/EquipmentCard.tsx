import Image from "next/image";
import Link from "next/link";
import { MapPin, Package } from "lucide-react";
import { EquipmentItem } from "@/data/equipment";

interface EquipmentCardProps {
  equipment: EquipmentItem;
}

const EquipmentCard = ({ equipment }: EquipmentCardProps) => {
  const equipmentId = equipment._id || equipment.id;

  const isAvailable = equipment.availableQuantity > 0;

  const formattedPrice = Number(equipment.rentalPrice).toLocaleString(
    "en-BD"
  );

  return (
    <div className="overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Equipment Image */}
      <div className="relative h-56 w-full bg-base-200">
        {equipment.image?.trim() ? (
          <Image
            src={equipment.image}
            alt={equipment.name}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package size={48} className="text-base-content/30" />
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute right-3 top-3">
          <span
            className={`badge ${
              isAvailable ? "badge-success" : "badge-error"
            }`}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      {/* Equipment Information */}
      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {equipment.category}
          </p>

          <h2 className="mt-1 line-clamp-1 text-lg font-bold text-base-content">
            {equipment.name}
          </h2>
        </div>

        {/* Rental Price */}
        <div>
          <span className="text-xl font-bold text-primary">
            ৳{formattedPrice}
          </span>

          <span className="ml-1 text-sm text-base-content/50">
            / {equipment.rentalType || "rental"}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-base-content/60">
          <MapPin size={16} />
          <span className="line-clamp-1">{equipment.location}</span>
        </div>

        {/* Quantity */}
        <p className="text-sm text-base-content/60">
          Available quantity:{" "}
          <span className="font-semibold text-base-content">
            {equipment.availableQuantity}
          </span>
        </p>

        {/* View Details */}
        <Link
          href={`/all-equipment/${equipmentId}`}
          className="btn btn-primary w-full"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EquipmentCard;