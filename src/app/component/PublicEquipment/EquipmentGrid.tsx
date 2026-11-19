import { EquipmentItem } from "@/data/equipment";
import EquipmentCard from "./EquipmentCard";

interface EquipmentGridProps {
  equipments: EquipmentItem[];
}

const EquipmentGrid = ({ equipments }: EquipmentGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {equipments.map((equipment) => (
        <EquipmentCard
          key={equipment._id || equipment.id}
          equipment={equipment}
        />
      ))}
    </div>
  );
};

export default EquipmentGrid;