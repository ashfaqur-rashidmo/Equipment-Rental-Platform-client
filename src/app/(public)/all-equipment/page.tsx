
import { GetEquipments } from "@/lib/api/getEquipments";
import { EquipmentItem } from "@/data/equipment";
import {
  GetEquipmentCategories,
  type EquipmentCategory,
} from "@/lib/api/getEquipmentCategories";
import { categories as siteCategories } from "@/data/categories";
import AllEquipmentClient from "./AllEquipmentClient";

interface PageProps {
  searchParams: Promise<
    Record<string, string | string[] | undefined>
  >;
}

const AllEquipmentsPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  // The API returns the full collection; search/filters are applied in
  // AllEquipmentClient using the current URL search params.
  const [equipments, categoryRows] = await Promise.all([
    // The equipment list is optional for the listing page — fall back to
    // an empty list when the API is unavailable.
    GetEquipments().catch((error) => {
      console.error("Failed to load equipment listing:", error);
      return [] as EquipmentItem[];
    }),
    GetEquipmentCategories(),
  ]);

  // Fall back to the static site categories if the API is unavailable.
  const categories: EquipmentCategory[] =
    categoryRows ?? siteCategories.map((category) => ({ name: category.name }));

  return (
    <AllEquipmentClient
      equipments={equipments}
      initialSearch={
        typeof params.search === "string" ? params.search : ""
      }
      categories={categories}
    />
  );
};

export default AllEquipmentsPage;
