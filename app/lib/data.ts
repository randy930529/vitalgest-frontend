import { cache } from "react";
import { ResponseAPIType, UserType } from "./definitions";
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

    const fetchUsersFromApi = cache(async (): Promise<ResponseAPIType> => {
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
    });

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
