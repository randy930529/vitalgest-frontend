import { cache } from "react";
// import { cookies } from "next/headers";
import { ResponseAPIType, UserType } from "./definitions";

export async function fetchUsers(): Promise<UserType[]> {
  try {
    // Obtener el token desde la cache usando cookies (Next.js recomienda cookies para datos persistentes)
    // const apiToken = (await cookies()).get("apiToken")?.value;
    const apiToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZkM2JkMTlhLWE1NjQtNDA1NC1iZTNmLTRkYjk5ZTExNjcwMyIsIm5hbWUiOiJEYW5pZWwiLCJsYXN0bmFtZSI6IlppcGEiLCJlbWFpbCI6ImRhbmllbHppcGFAb3V0bG9vay5jb20iLCJyb2xlIjoiZ2VuZXJhbF9hZG1pbiIsInBvc2l0aW9uIjoiZGV2ZWxvcGVyIiwidHlwZSI6IkFDQ0VTUyIsImlhdCI6MTc1Nzc4MjIwNywiZXhwIjoxNzU3Nzg5NDA3fQ.qMiuWrdtNuprlVR3wsXFAdUFgXlu2s_Y7YbwgzPjKZQ";

    if (!process.env.API_URL /* || !apiToken*/) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }
    const endPoint = `${process.env.API_URL}/api/adm/get-all/users/5`;

    // Implementar cache
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
  // Obtener el token desde la cache usando cookies (Next.js recomienda cookies para datos persistentes)
  // const apiToken = (await cookies()).get("apiToken")?.value;
  const apiToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZkM2JkMTlhLWE1NjQtNDA1NC1iZTNmLTRkYjk5ZTExNjcwMyIsIm5hbWUiOiJEYW5pZWwiLCJsYXN0bmFtZSI6IlppcGEiLCJlbWFpbCI6ImRhbmllbHppcGFAb3V0bG9vay5jb20iLCJyb2xlIjoiZ2VuZXJhbF9hZG1pbiIsInBvc2l0aW9uIjoiZGV2ZWxvcGVyIiwidHlwZSI6IkFDQ0VTUyIsImlhdCI6MTc1Nzc4MjIwNywiZXhwIjoxNzU3Nzg5NDA3fQ.qMiuWrdtNuprlVR3wsXFAdUFgXlu2s_Y7YbwgzPjKZQ";

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
