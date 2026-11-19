
import { GetEquipments } from "@/lib/api/getEquipments";
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

const equipments = await GetEquipments(query);

  return (
    <AllEquipmentClient
      equipments={equipments}
      initialSearch={urlSearch.get("search") || ""}
    />
  );
};

export default AllEquipmentsPage;
