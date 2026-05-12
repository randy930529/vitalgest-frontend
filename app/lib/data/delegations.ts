import {
  DelegationType,
  PaginatedResult,
  UserType,
} from "@/app/lib/definitions";
import { DataFetch } from "@/app/lib/core/base-data";

export async function fetchDelegations(
  params?: Record<string, string | number | boolean>,
): Promise<PaginatedResult<DelegationType>> {
  try {
    const endPoint = "/api/delegations/many";

    const dataFetching = new DataFetch<DelegationType>(endPoint);
    const delegations = await dataFetching.getAll(params);

    return delegations;
  } catch (err) {
    console.log("API Error[GET DELEGATIONS]:", err);
    return { data: [], totalRecords: 0 };
  }
}

export async function fetchDelegationById(
  id: string,
): Promise<DelegationType | undefined> {
  try {
    const endPoint = `/api/delegations/one/${id}`;

    const dataFetching = new DataFetch<DelegationType>(endPoint);
    const delegation = await dataFetching.getOne();

    return delegation;
  } catch (error) {
    console.log("Database Error:", error);
    return;
  }
}

export async function fetchDelegationMembers(
  delegationId: string,
  params?: Record<string, string | number | boolean>,
): Promise<PaginatedResult<UserType>> {
  try {
    const endPoint = `/api/delegations/members/${delegationId}`;

    const dataFetching = new DataFetch<UserType>(endPoint);
    const members = await dataFetching.getAll(params);

    return members;
  } catch (err) {
    console.log("API Error[GET DELEGATION MEMBERS]:", err);
    return { data: [], totalRecords: 0 };
  }
}
