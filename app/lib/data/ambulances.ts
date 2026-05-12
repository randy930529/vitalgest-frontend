import {
  AmbulanceAreaType,
  AmbulanceType,
  PaginatedResult,
} from "@/app/lib/definitions";
import { DataFetch } from "@/app/lib/core/base-data";

export async function fetchAmbulances(
  params?: Record<string, string | number | boolean>,
): Promise<PaginatedResult<AmbulanceType>> {
  try {
    const endPoint = "/api/ambulances/many";

    const dataFetching = new DataFetch<AmbulanceType>(endPoint, true);
    const ambulances = await dataFetching.getAll(params);

    return ambulances;
  } catch (err) {
    console.log("API Error[GET AMBULANCES]:", err);
    return { data: [], totalRecords: 0 };
  }
}

export async function fetchAmbulanceById(
  id: string,
): Promise<AmbulanceType | undefined> {
  try {
    const endPoint = `/api/ambulances/one/${id}`;
    const dataFetching = new DataFetch<AmbulanceType>(endPoint, true);
    const ambulance = await dataFetching.getOne();

    return ambulance;
  } catch (error) {
    console.log("Database Error:", error);
    return;
  }
}

export async function fetchAmbulancesByDelegationId(
  delegationId: string,
): Promise<PaginatedResult<AmbulanceType>> {
  try {
    const endPoint = "/api/ambulances/many";

    const dataFetching = new DataFetch<AmbulanceType>(endPoint, true);
    const ambulances = await dataFetching.getAll();

    return {
      data: ambulances.data.filter(
        (ambulance) => ambulance.delegation.id === delegationId,
      ),
      totalRecords: 0,
    };
  } catch (error) {
    console.log("API Error[GET AMBULANCES BY DELEGATION ID]:", error);
    return { data: [], totalRecords: 0 };
  }
}

export async function fetchAmbulanceAreas(): Promise<
  PaginatedResult<AmbulanceAreaType>
> {
  try {
    const endPoint = "/api/ambulances/areas";

    const dataFetching = new DataFetch<AmbulanceAreaType>(endPoint, true);
    const areas = await dataFetching.getAll();

    return areas;
  } catch (err) {
    console.log("API Error[GET AREAS]:", err);
    return { data: [], totalRecords: 0 };
  }
}
