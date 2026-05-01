import {
  CustomMxState,
  CustomOptions,
  MunicipalityType,
  MxStateType,
} from "@/app/lib/definitions";
import { DataFetch } from "@/app/lib/core/base-data";

export async function fetchMxStates(): Promise<CustomMxState[]> {
  try {
    const endPoint = "/api/delegations/states";

    const dataFetching = new DataFetch<MxStateType>(endPoint);
    const { data: states } = await dataFetching.getAll();

    const customStates = states?.map<CustomMxState>(
      ({ id, name, municipalities }) => ({
        id,
        value: `${id}-${name}`,
        label: name,
        municipalities: municipalities.map(({ id, name }) => ({
          id,
          value: `${id}-${name}`,
          label: name,
        })),
      }),
    ) || {
      id: 0,
      value: "",
      label: "No se encontraron estados",
      municipalities: [],
    };

    return customStates;
  } catch (err) {
    console.log("API Error[GET STATES]:", err);
    return [];
  }
}

export async function fetchMunicipalityByStateId(
  id: number,
): Promise<CustomOptions[]> {
  try {
    const endPoint = `/api/delegations/state/${id}/municipalities`;

    const dataFetching = new DataFetch<MunicipalityType>(endPoint);
    const { data: municipalities } = await dataFetching.getAll();

    const customStates = municipalities?.map(({ id, name }) => ({
      id,
      value: String(id),
      label: name,
    })) || { id: "0", value: "", label: "No se encontraron municipios" };

    return customStates;
  } catch (err) {
    console.log("API Error[GET MUNICIPALITIES]:", err);
    return [];
  }
}
