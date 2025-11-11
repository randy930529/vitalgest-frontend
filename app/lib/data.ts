import { cache } from "react";
import {
  AmbulanceType,
  CheckListAmbulanceType,
  ChecklistQuestionsType,
  CustomMxState,
  CustomOptions,
  DelegationType,
  GuardType,
  MxState,
  ResponseAPIType,
  ShiftType,
  StepItemType,
  UserType,
} from "@/app/lib/definitions";
import { verifyAuthorization, verifySession } from "@/app/lib/dal";

export async function fetchUsers(): Promise<UserType[]> {
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
    return res.data;
  } catch (err) {
    console.log("API Error[GET USERS]:", err);
    return [];
  }
}

export async function fetchUsersGuardChief(): Promise<CustomOptions[]> {
  try {
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    if (
      !verifyAuthorization(session) &&
      session?.user?.role !== "general_admin"
    )
      return [];
    const apiToken = session?.accessToken;

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

    if (!res.data?.length) return [];

    const guardChiefs = res.data.filter(({ role, status }) => {
      let active = false;
      if (typeof status === "string") {
        active = status === "true";
      } else {
        active = !!status;
      }
      return ["head_guard"].includes(role) && active;
    });

    const customUserGuardChief = guardChiefs.map<CustomOptions>(
      ({ id, name, lastname }) => ({
        id,
        value: id,
        label: `${name} ${lastname}`,
      })
    ) || {
      id: 0,
      value: "",
      label: "No se encontraron jefes de guardia.",
    };

    return customUserGuardChief;
  } catch (err) {
    console.log("API Error[GET DELEGATIONS]:", err);
    return [];
  }
}

export async function fetchUserById(id: string): Promise<UserType | undefined> {
  try {
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    const apiToken = session?.accessToken;

    const endPoint = `${process.env.API_URL}/api/adm/get/user/${id}`;
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
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    const apiToken = session?.accessToken;

    const endPoint = `${process.env.API_URL}/api/delegations/one/${id}`;
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

export async function fetchGuards(): Promise<GuardType[]> {
  try {
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    const apiToken = session?.accessToken;

    const endPoint = `${process.env.API_URL}/api/guards/many/all`;

    const fetchGuardsFromApi = cache(
      async (): Promise<ResponseAPIType<GuardType[]>> => {
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

    const res = await fetchGuardsFromApi();

    if (!res.success) {
      throw new Error(res.error);
    }

    return res.data;
  } catch (err) {
    console.log("API Error[GET GUARDS]:", err);
    return [];
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

export async function fetchAmbulances(): Promise<AmbulanceType[]> {
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

    const endPoint = `${process.env.API_URL}/api/ambulances/many/all`;

    const fetchAmbulancesFromApi = cache(
      async (): Promise<ResponseAPIType<AmbulanceType[]>> => {
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
            error: "No se pudo obtener las ambulancias desde la API.",
          };
        }

        return response.json();
      }
    );

    const res = await fetchAmbulancesFromApi();
    console.log(res);

    if (!res.success) {
      throw new Error(res.error);
    }
    return res.data;
  } catch (err) {
    console.log("API Error[GET AMBULANCES]:", err);
    return [];
  }
}

export async function fetchAmbulanceById(
  id: string
): Promise<AmbulanceType | undefined> {
  try {
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    const apiToken = session?.accessToken;

    const endPoint = `${process.env.API_URL}/api/ambulances/one/${id}`;
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

export async function fetchChecklistQuestions(
  category?: number
): Promise<ChecklistQuestionsType[]> {
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

    const param = category ? `?category=${category}` : "";
    const endPoint = `${process.env.API_URL}/api/checklists/ambulance/questions${param}`;

    const fetchChecklistQuestionsFromApi = cache(
      async (): Promise<ResponseAPIType<ChecklistQuestionsType[]>> => {
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
            error: "No se pudo obtener las preguntas desde la API.",
          };
        }

        return response.json();
      }
    );

    const res = await fetchChecklistQuestionsFromApi();
    console.log(res);

    if (!res.success) {
      throw new Error(res.error);
    }
    return res.data;
  } catch (err) {
    console.log("API Error[GET QUESTIONS]:", err);
    return [];
  }
}

export async function fetchChecklistSteps(): Promise<[StepItemType[], number]> {
  try {
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    if (!verifyAuthorization(session)) return [[], 0];
    const apiToken = session.accessToken;

    const endPoint = `${process.env.API_URL}/api/checklists/ambulance/questions`;

    const fetchChecklistQuestionsFromApi = cache(
      async (): Promise<ResponseAPIType<ChecklistQuestionsType[]>> => {
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
            error: "No se pudo obtener las preguntas desde la API.",
          };
        }

        return response.json();
      }
    );

    const res = await fetchChecklistQuestionsFromApi();
    console.log(res);

    if (!res.success) {
      throw new Error(res.error);
    }

    //TODO: Extrar esta logica como utilidad------------------
    const steps = Array.from(
      new Map(
        res.data.map<[string, StepItemType]>(
          ({ order_category, name_category }) => [
            `${order_category}-${name_category}`,
            { id: order_category, label: name_category },
          ]
        )
      ).values()
    );
    steps.sort((a, b) => a.id - b.id);
    // -------------------------------------------------------
    console.log(steps);

    return [steps, steps.length];
  } catch (err) {
    console.log("API Error[GET STEPS]:", err);
    return [[], 0];
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

export async function fetchGuardById(
  id: string
): Promise<GuardType | undefined> {
  try {
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    const apiToken = session?.accessToken;

    const endPoint = `${process.env.API_URL}/api/guards/one/${id}`;
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

export async function fetchOpenGuardsByUserMe(): Promise<GuardType[]> {
  try {
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    const apiToken = session?.accessToken;
    const userId = session?.user.id;

    const endPoint = `${process.env.API_URL}/api/guards/many/all`;
    const fetchGuardsFromApi = cache(
      async (): Promise<ResponseAPIType<GuardType[]>> => {
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

    const result = await fetchGuardsFromApi();

    if (!result.success) {
      throw new Error(result.error);
    }
    console.log(result);

    // TODO: Filtrar las guardias en curso donde aparesca el usuario
    // const myOpenGuards = result.data.filter(({state,guardChief})=>state === "En curso" && (guardChief.id === userId))

    return result.data;
  } catch (error) {
    console.log("Database Error:", error);
    return [];
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
