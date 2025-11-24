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

    const userId = user.id;
    const delegationId = user.delegationId;

    const inlineGuard = getInlineGuard(guards, userId, delegationId);

    return [guards, inlineGuard];

    // TODO: Filtrar las guardias en curso donde aparesca el usuario
    // const myOpenGuards = result.data.filter(({state,guardChief})=>state === "En curso" && (guardChief.id === userId))
  } catch (error) {
    console.log("Database Error:", error);
    return [[], undefined];
  }
}

function getInlineGuard(
  guards: GuardType[],
  userId: string,
  delegationId: string
): GuardType | undefined {
  return guards.find(
    ({ delegation, guardChief, shifts, state }) =>
      delegation.id === delegationId &&
      //   state === "En curso" &&
      (guardChief.id === userId ||
        !!shifts.find(
          ({ driver, paramedical }) =>
            driver.id === userId || paramedical.id === userId
        ))
  );
}
