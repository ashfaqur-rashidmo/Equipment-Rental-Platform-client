import { Badge } from "@/components/ui/badge";
import React from "react";

type EquipmentCardProps = {
  equipment: NonCustomerFavorite;
};

type NonCustomerFavorite = {
  name: string;
  rentalPrice: string | number;
  rentalType?: string;
  availableQuantity?: number;
  image?: string;
};

const EquipmentCard = ({ equipment }: EquipmentCardProps) => {
    return (
        <div className="rounded-xl border border-base-200 bg-base-100 p-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <img
                    src={equipment.image || "/images/equipment/hero.jpg"}
                    alt={equipment.name}
                    className="h-9 w-9 object-cover rounded-md bg-base-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/equipment/hero.jpg";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-base-content truncate">
                    {equipment.name}
                  </p>
                  <p className="text-xs text-base-content/60 mt-0.5">
                    {equipment.rentalPrice} / {equipment.rentalType?.toLowerCase() ?? "daily"} · Stock:{" "}
                    {equipment.availableQuantity ?? 0}
                  </p>
                </div>
                <Badge variant="success" size="sm">
                  Approved
                </Badge>
              </div>
            </div>
    );
};

export default EquipmentCard;