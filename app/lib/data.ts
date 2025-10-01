import { cache } from "react";
import { DelegationType, ResponseAPIType, UserType } from "./definitions";
import { verifySession } from "./dal";

export async function fetchUsers(): Promise<UserType[]> {
  try {
    const session = await verifySession();
    const apiToken = session?.accessToken;
    if (!process.env.API_URL || !apiToken) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }
    const endPoint = `${process.env.API_URL}/api/adm/get-all/users/5`;

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
          // throw new Error("No se pudo obtener los usuarios desde la API.");
          return { success: false, data: [] };
        }

        return response.json();
      }
    );

    const res = await fetchUsersFromApi();
    console.log(res);
    return res.data as UserType[];
  } catch (err) {
    console.error("API Error[GET USERS]:", err);
    throw new Error("No se pudo obtener todos los usuarios.");
  }
}

export async function fetchUserById(id: string) {
  const session = await verifySession();
  const apiToken = session?.accessToken;

  if (!process.env.API_URL || !apiToken) {
    throw new Error(
      "Las variables de conexión a la API no están configuradas."
    );
  }

  const endPoint = `${process.env.API_URL}/api/adm/get/user/${id}`;
  try {
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
    return result.data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchDelegations(): Promise<DelegationType[]> {
  try {
    const session = await verifySession();
    const apiToken = session?.accessToken;

    if (!process.env.API_URL || !apiToken) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }
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
          // throw new Error("No se pudo obtener las delegaciones desde la API.");
          return { success: false, data: [] };
        }

        return response.json();
      }
    );

    const res = await fetchDelegationsFromApi();
    console.log(res);
    return res.data as DelegationType[];
    // return [
    //   {
    //     id: "uuid-1",
    //     estado: "Jalisco",
    //     municipio: "Guadalajara",
    //     userToRegister: "userId-1",
    //     createdAt: "2023-10-01",
    //   },
    //   {
    //     id: "uuid-2",
    //     estado: "Mexico D.F.",
    //     municipio: "Cuauhtémoc",
    //     userToRegister: "userId-2",
    //     createdAt: "2023-10-02",
    //   },
    // ];
  } catch (err) {
    console.error("API Error[GET DELEGATIONS]:", err);
    throw new Error("No se pudo obtener todas las delegaciones.");
  }
}

export async function fetchDelegationById(
  id: string
): Promise<DelegationType | undefined> {
  const session = await verifySession();
  const apiToken = session?.accessToken;

  if (!process.env.API_URL || !apiToken) {
    throw new Error(
      "Las variables de conexión a la API no están configuradas."
    );
  }

  const endPoint = `${process.env.API_URL}/api/delegations/one/${id}`;
  try {
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
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchGuards(): Promise<any[]> {
  try {
    const session = await verifySession();
    const apiToken = session?.accessToken;

    if (!process.env.API_URL || !apiToken) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }
    const endPoint = `${process.env.API_URL}/api/guards/many/all`;

    // const fetchGuardsFromApi = cache(
    //   async (): Promise<ResponseAPIType<GuardType[]>> => {
    //     const response = await fetch(endPoint, {
    //       headers: {
    //         Authorization: `Bearer ${apiToken}`,
    //         "Content-Type": "application/json",
    //       },
    //     });

    //     if (!response.ok) {
    //       console.log(await response.json());
    //       // throw new Error("No se pudo obtener las delegaciones desde la API.");
    //       return { success: false, data: [] };
    //     }

    //     return response.json();
    //   }
    // );

    // const res = await fetchGuardsFromApi();
    // console.log(res);
    // return res.data as GuardType[];
    return [
      {
        id: "uuid-1",
        guardChief: "userId-1",
        date: "2023-10-01",
        ambulance: "Ambulancia 1",
        state: "new",
        createdAt: "2023-10-01",
      },
      {
        id: "uuid-2",
        guardChief: "userId-2",
        date: "2023-10-02",
        ambulance: "Ambulancia 2",
        state: "ongoing",
        createdAt: "2023-10-02",
      },
      {
        id: "uuid-3",
        guardChief: "userId-3",
        date: "2023-10-03",
        ambulance: "Ambulancia 3",
        state: "closed",
        createdAt: "2023-10-03",
      },
    ];
  } catch (err) {
    console.error("API Error[GET DELEGATIONS]:", err);
    throw new Error("No se pudo obtener todas las delegaciones.");
  }
}

export async function fetchStates(): Promise<
  {
    id: string;
    value: string;
    label: string;
  }[]
> {
  try {
    const session = await verifySession();
    const apiToken = session?.accessToken;

    if (!process.env.API_URL || !apiToken) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }
    const endPoint = `${process.env.API_URL}/api/delegations/states`;

    const fetchStatesFromApi = cache(
      async (): Promise<
        ResponseAPIType<
          {
            id: string;
            name: string;
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
      }
    );

    const res = await fetchStatesFromApi();
    console.log(res);

    const customStates = res.data?.map(({ id, name }) => ({
      id,
      value: id,
      label: name,
    })) || { id: "0", value: "", label: "No se encontraron estados" };

    return customStates;
  } catch (err) {
    console.error("API Error[GET DELEGATIONS]:", err);
    throw new Error("No se pudo obtener todas las delegaciones.");
  }
}

export async function fetchMunicipalityByStateId(id: number): Promise<
  {
    id: number;
    value: number;
    label: string;
  }[]
> {
  try {
    const session = await verifySession();
    const apiToken = session?.accessToken;

    if (!process.env.API_URL || !apiToken) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }
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
      value: id,
      label: name,
    })) || { id: "0", value: "", label: "No se encontraron estados" };

    return customStates;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}
