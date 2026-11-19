
import { notFound } from "next/navigation";
import { GetEquipmentById } from "@/lib/api/getEquipmentById";
import EquipmentDetails from "@/app/component/PublicEquipment/EquipmentDetails";

interface PageProps {
  params: Promise<{ id: string }>;
}

const EquipmentDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params;

  const equipment = await GetEquipmentById(id);

  if (!equipment) notFound();

  return <EquipmentDetails equipment={equipment} />;
};

export default EquipmentDetailsPage;
