
import { API_BASE_URL } from "../baseurl";
import { EquipmentItem } from "@/data/equipment";


export const GetEquipmentById = async (
  id: string
): Promise<EquipmentItem | null> => {
  const response = await fetch(`${API_BASE_URL}/equipment/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) return null;

  return await response.json();
};
