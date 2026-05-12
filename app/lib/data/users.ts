import {
  CustomOptions,
  PaginatedResult,
  UserType,
} from "@/app/lib/definitions";
import { DataFetch } from "@/app/lib/core/base-data";

export async function fetchUsers(
  params?: Record<string, string | number | boolean>,
): Promise<PaginatedResult<UserType>> {
  try {
    const endPoint = "/api/adm/get-all/users";

    const dataFetching = new DataFetch<UserType>(endPoint);
    const users = await dataFetching.getAll(params);

    return users;
  } catch (err) {
    console.log("API Error[GET USERS]:", err);
    return { data: [], totalRecords: 0 };
  }
}

export async function fetchUsersGuardChief(): Promise<CustomOptions[]> {
  try {
    const endPoint = "/api/adm/get-all/users";

    const dataFetching = new DataFetch<UserType>(endPoint, true);
    const { data: users } = await dataFetching.getAll();

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
      }),
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

export async function fetchStaffMembers(
  delegationId: string,
): Promise<[CustomOptions[], CustomOptions[], CustomOptions[]]> {
  try {
    const endPoint = `/api/delegations/members/${delegationId}`;

    const dataFetching = new DataFetch<UserType>(endPoint, true);
    const { data: users } = await dataFetching.getAll();

    const userByRolesMap = new Map<string, CustomOptions[]>();
    users.forEach(({ id, role, name, lastname }) => {
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
    console.log("API Error[GET STAFF MEMBERS]:", err);
    return [[], [], []];
  }
}
