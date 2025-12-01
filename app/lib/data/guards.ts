import { GuardType, UserType } from "@/app/lib/definitions";
import { DataFetch } from "@/app/lib/data/data";

export async function fetchGuards(): Promise<GuardType[]> {
  try {
    const endPoint = "/api/guards/many/all";

    const dataFetching = new DataFetch<GuardType>(endPoint);
    const guards = await dataFetching.getAll();

    return guards;
  } catch (err) {
    console.log("API Error[GET GUARDS]:", err);
    return [];
  }
}

export async function fetchGuardById(
  id: string
): Promise<GuardType | undefined> {
  try {
    const endPoint = `${process.env.API_URL}/api/guards/one/${id}`;

    const dataFetching = new DataFetch<GuardType>(endPoint, true);
    const guard = await dataFetching.getOne();

    return guard;
  } catch (error) {
    console.log("Database Error:", error);
    return;
  }
}

export async function fetchGuardsAndInlineGuardByUserMe(
  user: UserType
): Promise<[GuardType[], GuardType | undefined]> {
  try {
    const endPoint = `${process.env.API_URL}/api/guards/many/all`;
    const dataFetching = new DataFetch<GuardType>(endPoint);
    const guards = await dataFetching.getAll();

    if (!guards.length) return [[], undefined];

    const userGuards = getGuardsByUserId(guards, user.id);
    const inlineGuard = getInlineGuard(userGuards);

    return [userGuards, inlineGuard];
  } catch (error) {
    console.log("Database Error:", error);
    return [[], undefined];
  }
}

function getGuardsByUserId(guards: GuardType[], userId: string): GuardType[] {
  return guards.filter(
    ({ guardChief, shifts }) =>
      guardChief.id === userId ||
      shifts.some(
        ({ driver, paramedical }) =>
          driver.id === userId || paramedical.id === userId
      )
  );
}

function getInlineGuard(guards: GuardType[]): GuardType | undefined {
  return guards.find(({ state }) => state === "En curso");
}
