import { SupplyAmbulanceType, SupplyPharmacyType } from "@/app/lib/definitions";
import { DataFetch } from "@/app/lib/data/data";

export async function fetchSuppliesByPharmacyId(
  pharmacyId: string | number
): Promise<SupplyPharmacyType[]> {
  try {
    const endPoint = `/api/supplies/pharmacy/${pharmacyId}`;

    const dataFetching = new DataFetch<SupplyPharmacyType>(endPoint, true);
    const supplies = await dataFetching.getAll();

    return supplies;
  } catch (err) {
    console.log("API Error[GET SUPPLIES]:", err);
    return [];
  }
}

export async function fetchSupplyById(
  id: string
): Promise<SupplyPharmacyType | undefined> {
  try {
    const endPoint = `/api/supplies/one/${id}`;

    const dataFetching = new DataFetch<SupplyPharmacyType>(endPoint, true);
    const supply = await dataFetching.getOne();

    return supply;
  } catch (error) {
    console.log("Database Error:", error);
    return;
  }
}

export async function fetchSuppliesByAmbulanceId(
  ambulanceId: string
): Promise<SupplyAmbulanceType[]> {
  try {
    const endPoint = `/api/ambulances/supplies/${ambulanceId}`;

    const dataFetching = new DataFetch<SupplyAmbulanceType>(endPoint, true);
    const supplies = await dataFetching.getAll();

    return supplies;
  } catch (err) {
    console.log("API Error[GET SUPPLIES]:", err);
    return [];
  }
}

export async function fetchAmbulanceSupplyById(
  id: string
): Promise<SupplyAmbulanceType | undefined> {
  try {
    const endPoint = `/api/ambulances/supplies/one/${id}`;

    const dataFetching = new DataFetch<SupplyAmbulanceType>(endPoint, true);
    const supply = await dataFetching.getOne();

    return supply;
  } catch (error) {
    console.log("Database Error:", error);
    return;
  }
}
