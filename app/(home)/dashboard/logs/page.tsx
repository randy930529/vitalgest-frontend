import { Metadata } from "next";
import { Suspense } from "react";
import { QueryParamsType } from "@/app/lib/definitions";
import { getPaginationParams } from "@/app/lib/utils";
import { fetchUsers } from "@/app/lib/data/users";
import { fetchLogsFilters, fetchLogs } from "@/app/lib/data/log";
import { TableSkeletonBase } from "@/app/ui/components/skeletons";
import LogsTable from "@/app/ui/dashboard/logs/logs-table";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import Breadcrumbs from "@/app/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Historial de Logs",
};

type LogsSearchParams = QueryParamsType & {
  entity?: string;
  action?: string;
  userId?: string;
  from?: string;
  to?: string;
};

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<LogsSearchParams>;
}) {
  // (Página) Listado de logs - [SSR]

  const {
    page,
    display,
    entity,
    action,
    userId,
    query: userSearch,
    from,
    to,
  } = await searchParams;

  const pagination = getPaginationParams(Number(page), Number(display));
  const filters = {
    entity,
    action,
    userId,
    userSearch,
    from,
    to,
  };

  const fetchLogsAndFilters = async () =>
    await Promise.all([
      fetchLogs({ ...pagination, ...filters }),
      fetchUsers().then((res) => res.data),
      fetchLogsFilters(),
    ]);

  return (
    <section className="vital-shell">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Logs", href: "/dashboard/logs", active: true },
        ]}
      />

      <Suspense fallback={<TableSkeletonBase />}>
        <WrapperTable
          fetchData={fetchLogsAndFilters}
          WrappedComponent={LogsTable}
        />
      </Suspense>
    </section>
  );
}
