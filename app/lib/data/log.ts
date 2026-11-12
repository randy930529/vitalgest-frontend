import {
  AuditLogsFiltersType,
  AuditLogType,
  PaginatedResult,
} from "@/app/lib/definitions";
import { DataFetch } from "@/app/lib/core/base-data";

type AuditLogQuery = {
  limit: number;
  offset: number;
  entity?: string;
  action?: string;
  userId?: string;
  userSearch?: string;
  from?: string;
  to?: string;
};

export async function fetchLogs(
  params: AuditLogQuery,
): Promise<PaginatedResult<AuditLogType>> {
  try {
    const endPoint = "/api/logs";

    const dataFetching = new DataFetch<AuditLogType>(endPoint, true);
    const logs = await dataFetching.getAll(params);

    return logs;
  } catch (error) {
    console.log("API Error[GET LOGS]:", error);
    return { data: [], totalRecords: 0 };
  }
}

export async function fetchLogsFilters(): Promise<
  AuditLogsFiltersType | undefined
> {
  try {
    const endPoint = "/api/logs/filters";

    const dataFetching = new DataFetch<AuditLogsFiltersType>(endPoint, true);
    const filters = await dataFetching.getOne();

    return filters;
  } catch (error) {
    console.log("API Error[GET LOG FILTERS]:", error);
    return;
  }
}
