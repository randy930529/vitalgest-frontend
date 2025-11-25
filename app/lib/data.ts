import { cache } from "react";
import { verifyAuthorization, verifySession } from "@/app/lib/dal";
import { DataFetch } from "@/app/lib/data/data";
import {
  CustomMxState,
  CustomOptions,
  DelegationType,
  MxState,
  ResponseAPIType,
  ShiftType,
  UserType,
} from "@/app/lib/definitions";

export async function fetchDelegations(): Promise<DelegationType[]> {
  try {
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    if (!verifyAuthorization(session)) return [];
    const apiToken = session.accessToken;

    const endPoint = `${process.env.API_URL}/api/delegations/many/all`;

    const fetchDelegationsFromApi = cache(
      async (): Promise<ResponseAPIType<DelegationType[]>> => {
        const response = await fetch(endPoint, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.log(await response.json());
          return {
            success: false,
            data: [],
            error: "No se pudo obtener las delegaciones desde la API.",
          };
        }

        return response.json();
      }
    );

    const res = await fetchDelegationsFromApi();
    console.log(res.data);

    if (!res.success) {
      throw new Error(res.error);
    }

    return res.data;
  } catch (err) {
    console.log("API Error[GET DELEGATIONS]:", err);
    return [];
  }
}

export async function fetchDelegationById(
  id: string
): Promise<DelegationType | undefined> {
  try {
    const endPoint = `/api/delegations/one/${id}`;

    const dataFetching = new DataFetch<DelegationType>(endPoint);
    const delegation = await dataFetching.getOne();

    return delegation;
  } catch (error) {
    console.log("Database Error:", error);
    return;
  }
}

export async function fetchMxStates(): Promise<CustomMxState[]> {
  try {
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    const apiToken = session?.accessToken;

    const endPoint = `${process.env.API_URL}/api/delegations/states`;

    const fetchStatesFromApi = cache(
      async (): Promise<ResponseAPIType<MxState[]>> => {
        const response = await fetch(endPoint, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.log(await response.json());
          return {
            success: false,
            data: [],
            error: "No se pudo obtener las delegaciones desde la API.",
          };
        }

        return response.json();
      }
    );

    const res = await fetchStatesFromApi();
    console.log(res);

    const customStates = res.data?.map<CustomMxState>(
      ({ id, name, municipalities }) => ({
        id,
        value: `${id}-${name}`,
        label: name,
        municipalities: municipalities.map(({ id, name }) => ({
          id,
          value: `${id}-${name}`,
          label: name,
        })),
      })
    ) || {
      id: 0,
      value: "",
      label: "No se encontraron estados",
      municipalities: [],
    };

    return customStates;
  } catch (err) {
    console.log("API Error[GET DELEGATIONS]:", err);
    return [];
  }
}

export async function fetchMunicipalityByStateId(
  id: number
): Promise<CustomOptions[]> {
  try {
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    const apiToken = session?.accessToken;

    const endPoint = `${process.env.API_URL}/api/delegations/state/${id}/municipalities`;

    const fetchMunicipalityFromApi = async (): Promise<
      ResponseAPIType<
        {
          id: number;
          name: string;
          state_id: number;
        }[]
      >
    > => {
      const response = await fetch(endPoint, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.log(await response.json());
        // throw new Error("No se pudo obtener las delegaciones desde la API.");
        return { success: false, data: [] };
      }

      return response.json();
    };

    const res = await fetchMunicipalityFromApi();
    console.log(res);

    const customStates = res.data?.map(({ id, name }) => ({
      id,
      value: String(id),
      label: name,
    })) || { id: "0", value: "", label: "No se encontraron estados" };

    return customStates;
  } catch (error) {
    console.log("Database Error:", error);
    return [];
  }
}

export async function fetchUsersGuardChiefsDriversAndParamedical(): Promise<
  [CustomOptions[], CustomOptions[], CustomOptions[]]
> {
  try {
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    if (!verifyAuthorization(session)) return [[], [], []];
    const apiToken = session.accessToken;

    const endPoint = `${process.env.API_URL}/api/adm/get-all/users/all`;

    const fetchUsersFromApi = cache(
      async (): Promise<ResponseAPIType<UserType[]>> => {
        const response = await fetch(endPoint, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.log(await response.json());
          return {
            success: false,
            data: [],
            error: "No se pudo obtener los usuarios desde la API.",
          };
        }

        return response.json();
      }
    );

    const res = await fetchUsersFromApi();
    console.log(res);

    if (!res.success) {
      throw new Error(res.error);
    }

    const userByRolesMap = new Map<string, CustomOptions[]>();
    res.data.forEach(({ id, role, name, lastname }) => {
      const customUsers = userByRolesMap.get(role) ?? [];
      customUsers.push({
        id,
        value: id,
        label: `${name} ${lastname}`,
      });
      userByRolesMap.set(role, customUsers);
    });

    return [
      userByRolesMap.get("head_guard") || [],
      userByRolesMap.get("vehicle_operator") || [],
      userByRolesMap.get("paramedical") || [],
    ];
  } catch (err) {
    console.log("API Error[GET USERS]:", err);
    return [[], [], []];
  }
}

export async function fetchShiftsByGuardId(id: string): Promise<ShiftType[]> {
  try {
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    const apiToken = session?.accessToken;

    const endPoint = `${process.env.API_URL}/api/shifts/guard/${id}`;
    const response = await fetch(endPoint, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    console.log(result);
    return result.data;
  } catch (error) {
    console.log("Database Error:", error);
    return [];
  }
}

export async function fetchShiftById(
  id: string
): Promise<ShiftType | undefined> {
  try {
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    const apiToken = session?.accessToken;

    const endPoint = `${process.env.API_URL}/api/shifts/one/${id}`;
    const response = await fetch(endPoint, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return;
    }

    const result = await response.json();
    console.log(result);
    return result.data;
  } catch (error) {
    console.log("Database Error:", error);
    return;
  }
}
