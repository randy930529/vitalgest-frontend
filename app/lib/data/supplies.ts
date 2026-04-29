import {
  PaginatedResult,
  SupplyAmbulanceType,
  SupplyPharmacyType,
} from "@/app/lib/definitions";
import { DataFetch } from "@/app/lib/core/base-data";

export async function fetchSuppliesByPharmacyId(
  pharmacyId: string | number,
  params?: Record<string, string | number | boolean>,
): Promise<PaginatedResult<SupplyPharmacyType>> {
  try {
    const endPoint = `/api/supplies/pharmacy/${pharmacyId}`;

    const dataFetching = new DataFetch<SupplyPharmacyType>(endPoint, true);
    const supplies = await dataFetching.getAll(params);

    return supplies;
  } catch (err) {
    console.log("API Error[GET SUPPLIES]:", err);
    return { data: [], totalRecords: 0 };
  }
}

export async function fetchSupplyById(
  id: string,
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
  ambulanceId: string,
  params?: Record<string, string | number | boolean>,
): Promise<PaginatedResult<SupplyAmbulanceType>> {
  try {
    const endPoint = `/api/ambulances/supplies/${ambulanceId}`;

    const dataFetching = new DataFetch<SupplyAmbulanceType>(endPoint, true);
    const supplies = await dataFetching.getAll(params);

    return supplies;
  } catch (err) {
    console.log("API Error[GET SUPPLIES]:", err);
    return { data: [], totalRecords: 0 };
  }
}

export async function fetchAmbulanceSupplyById(
  id: string,
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
