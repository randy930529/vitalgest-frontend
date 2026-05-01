import { GuardType, PaginatedResult, UserType } from "@/app/lib/definitions";
import { DataFetch } from "@/app/lib/core/base-data";

export async function fetchGuards(
  params?: Record<string, string | number | boolean>,
): Promise<PaginatedResult<GuardType>> {
  try {
    const endPoint = "/api/guards/many/all";

    const dataFetching = new DataFetch<GuardType>(endPoint);
    const guards = await dataFetching.getAll(params);

    return guards;
  } catch (err) {
    console.log("API Error[GET GUARDS]:", err);
    return { data: [], totalRecords: 0 };
  }
}

export async function fetchGuardById(
  id: string,
): Promise<GuardType | undefined> {
  try {
    const endPoint = `/api/guards/one/${id}`;

    const dataFetching = new DataFetch<GuardType>(endPoint, true);
    const guard = await dataFetching.getOne();

    return guard;
  } catch (error) {
    console.log("Database Error:", error);
    return;
  }
}

export async function fetchGuardsAndInlineGuardByUserMe(
  user: UserType,
): Promise<[PaginatedResult<GuardType>, GuardType | undefined]> {
  try {
    const endPoint = "/api/guards/many/all";
    const dataFetching = new DataFetch<GuardType>(endPoint);
    const guards = await dataFetching.getAll();

    if (!guards.data.length) return [{ data: [], totalRecords: 0 }, undefined];

    const userGuards = getGuardsByUserId(guards.data, user.id);
    const inlineGuard = getInlineGuard(userGuards);

    return [{ data: userGuards, totalRecords: userGuards.length }, inlineGuard];
  } catch (error) {
    console.log("Database Error:", error);
    return [{ data: [], totalRecords: 0 }, undefined];
  }
}

function getGuardsByUserId(guards: GuardType[], userId: string): GuardType[] {
  return guards.filter(
    ({ guardChief, shifts }) =>
      guardChief.id === userId ||
      shifts.some(
        ({ driver, paramedical }) =>
          driver.id === userId || paramedical.id === userId,
      ),
  );
}

function getInlineGuard(guards: GuardType[]): GuardType | undefined {
  return guards.find(({ state }) => state === "En curso");
}
