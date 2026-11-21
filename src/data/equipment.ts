export type RentalType = "daily" | "weekly" | "monthly";

export type EquipmentStatus = "pending" | "approved" | "rejected";

export type EquipmentCondition = "excellent" | "good" | "fair";

export interface EquipmentOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  category: string;
  rentalPrice: number;
  rentalType: RentalType;
  location: string;
  availableQuantity: number;
  condition: EquipmentCondition;
  brand: string;
  model: string;
  image: string;
  terms: string;
  rating: number;
  createdAt: string;
  status: EquipmentStatus;
  owner: EquipmentOwner;
}



export interface EquipmentItem {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  category: string;
  status: string;
  /** "Daily" | "Weekly" | "Monthly" as stored by the API. */
  rentalType?: string;
  rentalPrice: string | number;
  availableQuantity: number;
  rating?: number;
  location: string;
  brand?: string;
  model?: string;
  condition?: string;
  terms?: string;
  ownerName?: string;
  ownerEmail?: string;
  createdAt?: string;
  image?: string;
  ownerId?: string;
}

/**
 * Seed data used until the Express + MongoDB backend is connected.
 * The shape mirrors the server's equipment collection so the swap is
 * a fetch call away. Images are stored locally in /public/images.
 */


export const equipmentList: Equipment[] = [
  
];

export const formatPrice = (price: number) =>
  `৳${price.toLocaleString("en-US")}`;
