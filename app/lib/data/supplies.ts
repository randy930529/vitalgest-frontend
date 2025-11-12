import { SupplyType } from "@/app/lib/definitions";
import { DataFetch } from "./data";

export async function fetchSupplies(
  pharmacyId: string | number
): Promise<SupplyType[]> {
  try {
    const endPoint = `/api/supplies/pharmacy/${pharmacyId}`;

    const dataFetching = new DataFetch<SupplyType>(endPoint, true);
    const supplies = await dataFetching.getAll();

    return supplies;
  } catch (err) {
    console.log("API Error[GET SUPPLIES]:", err);
    return [];
  }
}

export async function fetchSupplyById(
  id: string
): Promise<SupplyType | undefined> {
  try {
    const endPoint = `/api/supplies/one/${id}`;

    const dataFetching = new DataFetch<SupplyType>(endPoint, true);
    const supply = await dataFetching.getOne();

    return supply;
  } catch (error) {
    console.log("Database Error:", error);
    return;
  }
}
