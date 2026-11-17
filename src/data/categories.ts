import {
  Camera,
  HardHat,
  Laptop,
  PartyPopper,
  Tractor,
  Truck,
  type LucideIcon,
} from "lucide-react";

export interface Category {
  name: string;
  count: number;
  icon: LucideIcon;
  /** Static Tailwind classes for the icon tile tint. */
  tint: string;
}

export const categories: Category[] = [
  {
    name: "Construction Equipment",
    count: 142,
    icon: HardHat,
    tint: "bg-amber-500/10 text-amber-600",
  },
  {
    name: "Photography Equipment",
    count: 98,
    icon: Camera,
    tint: "bg-sky-500/10 text-sky-600",
  },
  {
    name: "Vehicles & Transportation",
    count: 76,
    icon: Truck,
    tint: "bg-emerald-500/10 text-emerald-600",
  },
  {
    name: "Agriculture Equipment",
    count: 64,
    icon: Tractor,
    tint: "bg-lime-500/10 text-lime-600",
  },
  {
    name: "Electronics",
    count: 121,
    icon: Laptop,
    tint: "bg-violet-500/10 text-violet-600",
  },
  {
    name: "Event Equipment",
    count: 89,
    icon: PartyPopper,
    tint: "bg-rose-500/10 text-rose-600",
  },
];
