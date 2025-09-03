import { cache } from "react";
import { cookies } from "next/headers";
import { ResponseAPI, User } from "./definitions";

export async function fetchUsers(): Promise<User[]> {
  try {
    // Obtener la URL del API y el token de las variables de entorno
    const apiUrl = process.env.API_URL;
    // Obtener el token desde la cache usando cookies (Next.js recomienda cookies para datos persistentes)
    // const apiToken = (await cookies()).get("apiToken")?.value;

    if (!apiUrl /* || !apiToken*/) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }
    const endPoint = `${apiUrl}/api/adm/get-all/users/5`;

    // Implementar cache
    const fetchUsersFromApi = cache(async (): Promise<ResponseAPI> => {
      const response = await fetch(endPoint, {
        headers: {
          Authorization: `Bearer ${"apiToken"}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener los usuarios desde la API.");
      }

      return response.json();
    });

    const res = await fetchUsersFromApi();
    console.log(res);
    return res.data as User[];
  } catch (err) {
    console.error("API Error[GET USERS]:", err);
    throw new Error("No se pudo obtener todos los usuarios.");
  }
}
