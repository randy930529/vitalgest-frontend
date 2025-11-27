import { AmbulanceAreaType, AmbulanceType } from "@/app/lib/definitions";
import { DataFetch } from "@/app/lib/data/data";

export async function fetchAmbulances(): Promise<AmbulanceType[]> {
  try {
    const endPoint = "/api/ambulances/many/all";

    const dataFetching = new DataFetch<AmbulanceType>(endPoint, true);
    const ambulances = await dataFetching.getAll();

    return ambulances;
  } catch (err) {
    console.log("API Error[GET AMBULANCES]:", err);
    return [];
  }
}

export async function fetchAmbulanceById(
  id: string
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
  delegationId: string
): Promise<AmbulanceType[]> {
  try {
    const endPoint = "/api/ambulances/many/all";

    const dataFetching = new DataFetch<AmbulanceType>(endPoint, true);
    const ambulances = await dataFetching.getAll();

    return ambulances.filter(
      (ambulance) => ambulance.delegation.id === delegationId
    );
  } catch (error) {
    console.log("API Error[GET AMBULANCES BY DELEGATION ID]:", error);
    return [];
  }
}

export async function fetchAmbulanceAreas(): Promise<AmbulanceAreaType[]> {
  try {
    const endPoint = "/api/ambulances/areas";

    const dataFetching = new DataFetch<AmbulanceAreaType>(endPoint, true);
    const areas = await dataFetching.getAll();

    return areas;
  } catch (err) {
    console.log("API Error[GET AREAS]:", err);
    return [];
  }
}
