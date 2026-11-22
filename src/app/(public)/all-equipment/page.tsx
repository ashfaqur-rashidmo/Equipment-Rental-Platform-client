
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

  // Convert searchParams into a query string
  const urlSearch = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string") {
      urlSearch.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => urlSearch.append(key, item));
    }
  });

  const query = urlSearch.toString();

  // Facet counts ignore the `category` param itself, so the category
  // list keeps every option while one of them is selected.
  const facetSearch = new URLSearchParams(urlSearch);
  facetSearch.delete("category");
  const facetQuery = facetSearch.toString();

  const [equipments, categoryRows] = await Promise.all([
    // The equipment list is optional for the listing page — fall back to
    // an empty list when the API is unavailable.
    GetEquipments(query).catch(() => [] as EquipmentItem[]),
    GetEquipmentCategories(facetQuery),
  ]);

  // Fall back to the static site categories if the API is unavailable.
  const categories: EquipmentCategory[] =
    categoryRows ?? siteCategories.map((category) => ({ name: category.name }));

  return (
    <AllEquipmentClient
      equipments={equipments}
      initialSearch={urlSearch.get("search") || ""}
      categories={categories}
    />
  );
};

export default AllEquipmentsPage;
