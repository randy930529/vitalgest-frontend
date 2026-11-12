"use client";

import clsx from "clsx";
import { FunnelIcon } from "@heroicons/react/24/outline";
import {
  AuditLogsFiltersType,
  AuditLogType,
  PaginatedResult,
  UserType,
} from "@/app/lib/definitions";
import { STYLES } from "@/app/lib/config/constants";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import { modalComponents } from "@/app/lib/config/modalConfig";
import TablePagination from "@/app/ui/components/pagination";
import EmptyTableRow from "@/app/ui/components/empty-table-row";
import Filters from "@/app/ui/dashboard/table-filters";
import ModalTrigger from "@/app/ui/button-modal";
import { Button } from "@/app/ui/button";

const ModalComponent = modalComponents.logsFiltersForm;

const customHeaders = [
  { id: 0, label: "Fecha" },
  { id: 1, label: "Usuario" },
  { id: 2, label: "Entidad" },
  { id: 3, label: "Acción" },
  { id: 4, label: "Descripción" },
  { id: 5, label: "Afectado" },
];

export default function LogsTable({
  data,
}: {
  data: [
    PaginatedResult<AuditLogType>,
    UserType[],
    AuditLogsFiltersType | undefined,
  ];
}) {
  // (Component) Tabla interactiva de logs - [CSR]

  const [{ data: logs, totalRecords }, users, filters] = data;

  return (
    <main className={clsx(STYLES.mainTable)}>
      <Filters>
        <ModalTrigger
          title="Filtros de Registros"
          modelContent={<ModalComponent filters={filters} users={users} />}
          buttonToggle={<FiltersButton />}
        />
      </Filters>
      <div className="overflow-x-auto">
        <table className={clsx(STYLES.table)}>
          <caption className="sr-only">
            Historial de acciones de auditoría del sistema.
          </caption>
          <thead className={clsx(STYLES.headerTable)}>
            <tr>
              {customHeaders.map((header) => (
                <th key={header.id} scope="col" className="px-4 py-3">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <EmptyTableRow
              isListEmpty={!logs.length}
              colSpan={6}
              message="No hay logs para mostrar. Utiliza los filtros para mostrar resultados."
            />
            {logs.map((log) => (
              <tr key={log.id} className={clsx(STYLES.rowTable)}>
                <td className="whitespace-nowrap px-4 py-3.5">
                  {formatDateToDDMMYYYY(log.createdAt)}
                  <div className="text-xs text-slate-500">
                    {new Date(log.createdAt).toLocaleTimeString("es-MX", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "UTC",
                    })}{" "}
                    UTC
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-medium text-slate-900">
                    {log.user.name} {log.user.lastname}
                  </div>
                  <div className="text-xs text-slate-500">{log.user.email}</div>
                </td>
                <td className="px-4 py-3.5">{log.entity}</td>
                <td className="px-4 py-3.5">{log.action}</td>
                <td className="min-w-64 px-4 py-3.5">{log.description}</td>
                <td className="px-4 py-3.5 font-mono text-xs">
                  {log.affected}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination totalItems={totalRecords} />
    </main>
  );
}

export function FiltersButton({ onClose }: { onClose?: () => void }) {
  return (
    <Button
      onClick={onClose}
      className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
    >
      <FunnelIcon className="w-5 h-5 me-2" />
      Filtrar Registros
    </Button>
  );
}
