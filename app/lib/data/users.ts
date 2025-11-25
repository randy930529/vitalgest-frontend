import { CustomOptions, UserType } from "@/app/lib/definitions";
import { DataFetch } from "@/app/lib/data/data";

export async function fetchUsers(): Promise<UserType[]> {
  try {
    const endPoint = "/api/adm/get-all/users/all";

    const dataFetching = new DataFetch<UserType>(endPoint);
    const users = await dataFetching.getAll();

    return users;
  } catch (err) {
    console.log("API Error[GET USERS]:", err);
    return [];
  }
}

export async function fetchUsersGuardChief(): Promise<CustomOptions[]> {
  try {
    const endPoint = "/api/adm/get-all/users/all";

    const dataFetching = new DataFetch<UserType>(endPoint, true);
    const users = await dataFetching.getAll();

    if (!users) return [];

    const guardChiefs = users.filter(({ role, status }) => {
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
    console.log("API Error[GET GUARD CHIEF]:", err);
    return [];
  }
}

export async function fetchUserById(id: string): Promise<UserType | undefined> {
  try {
    const endPoint = `/api/adm/get/user/${id}`;

    const dataFetching = new DataFetch<UserType>(endPoint, true);
    const user = await dataFetching.getOne();

    return user;
  } catch (error) {
    console.log("Database Error:", error);
    return;
  }
}
