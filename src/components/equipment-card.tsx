"use client";

import { formatPrice, type Equipment, type RentalType } from "@/data/equipment";
import { useSession } from "@/lib/auth-client";
import { Clock, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const rentalTypeLabel: Record<RentalType, string> = {
  daily: "day",
  weekly: "week",
  monthly: "month",
};

const rentalTypeTitle: Record<RentalType, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

interface EquipmentCardProps {
  equipment: Equipment;
  /** Increase when more than ~9 cards render in a grid. */
  priority?: boolean;
}

export function EquipmentCard({ equipment, priority = false }: EquipmentCardProps) {
  const { data: session } = useSession();
  const available = equipment.availableQuantity > 0;

  // Assignment rule: visitors who are not logged in are sent to Login
  // instead of the equipment details page.
  const detailsHref = session ? `/equipment/${equipment.id}` : "/login";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <figure className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={equipment.image}
          alt={equipment.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className="badge badge-primary badge-sm absolute left-3 top-3 border-none font-semibold">
          {equipment.category.replace(" Equipment", "")}
        </span>
        <span
          className={`badge badge-sm absolute right-3 top-3 border-none font-semibold ${
            available ? "badge-success" : "badge-error"
          }`}
        >
          {available ? "Available" : "Unavailable"}
        </span>
      </figure>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-1 text-lg font-semibold text-base-content">
          {equipment.name}
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-base-content/60">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-primary" aria-hidden />
            {equipment.location}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" aria-hidden />
            {equipment.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-primary" aria-hidden />
            {rentalTypeTitle[equipment.rentalType]} rental
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-base-200 pt-4">
          <div>
            <p className="text-xs text-base-content/50">From</p>
            <p className="text-lg font-bold text-primary">
              {formatPrice(equipment.rentalPrice)}
              <span className="text-sm font-medium text-base-content/50">
                /{rentalTypeLabel[equipment.rentalType]}
              </span>
            </p>
          </div>
          <Link href={detailsHref} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
