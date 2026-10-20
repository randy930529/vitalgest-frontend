"use client";

import clsx from "clsx";
import { Tooltip } from "react-tooltip";
import {
  AmbulanceType,
  CustomOptions,
  DelegationType,
  GuardType,
  PaginatedResult,
} from "@/app/lib/definitions";
import { STYLES } from "@/app/lib/config/constants";
import { deleteGuard } from "@/app/lib/actions/guard";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import { modalComponents } from "@/app/lib/config/modalConfig";
import { useTableSelection } from "@/app/lib/hooks/useTableSelection";
import ModalTrigger from "@/app/ui/button-modal";
import TableActions from "@/app/ui/dashboard/tabla-actions";
import TablePagination from "@/app/ui/components/pagination";
import Filters from "@/app/ui/dashboard/table-filters";
import TableActionDelete from "@/app/ui/dashboard/button-delete";
import TableActionEdit from "@/app/ui/dashboard/botton-edit";
import TableActionDeleteAllSelected from "@/app/ui/dashboard/button-delete-all";
import { Badge } from "@/app/ui/components/badges";
import { TableActionDetail } from "@/app/ui/dashboard/guards/botton-guard-detail";
import EmptyTableRow from "@/app/ui/components/empty-table-row";
import TableCheckbox from "@/app/ui/dashboard/table-checkbox";

const ModalComponent = modalComponents.guardForm;
const customHeaders = [
  { id: 0, label: "Jefe de Guardia" },
  { id: 1, label: "Fecha" },
  { id: 2, label: "Ambulancias" },
  { id: 3, label: "Estado" },
];

export default function GuardsTable({
  data,
  readonly,
  route,
}: {
  data: [
    PaginatedResult<GuardType>,
    AmbulanceType[],
    DelegationType[],
    [CustomOptions[], CustomOptions[], CustomOptions[]],
  ];
  readonly?: boolean;
  route?: string;
}) {
  // (Component) Lista de guardias existentes - [CSR]

  const [
    { data: guards, totalRecords },
    ambulances,
    delegations,
    [guardChiefs, drivers, paramedicals],
  ] = data;
  const customAmbulances = ambulances.map<CustomOptions>(({ id, number }) => ({
    id,
    label: number,
    value: id,
  }));
  const {
    selectedIds,
    setSelectedIds,
    allSelected,
    handleCheckboxChange,
    handleSelectAllChange,
  } = useTableSelection(guards);

  return (
    <main className={clsx(STYLES.mainTable)}>
      <Filters>
        {selectedIds.length > 0 && (
          <TableActionDeleteAllSelected
            selectedIds={selectedIds}
            actionDelete={async (ids: string[]) => {
              await Promise.all(ids.map((id) => deleteGuard(id)));
              setSelectedIds([]);
            }}
          />
        )}
        {!readonly && (
          <ModalTrigger
            title="Crear Guardia"
            modelContent={
              <ModalComponent
                guardChiefs={guardChiefs}
                delegations={delegations}
                ambulances={customAmbulances}
                drivers={drivers}
                paramedicals={paramedicals}
              />
            }
          />
        )}
      </Filters>
      {!readonly && (
        <p className="px-4 py-2 text-xs text-slate-500" aria-live="polite">
          {selectedIds.length > 0
            ? `${selectedIds.length} elemento(s) seleccionado(s)`
            : "Selecciona elementos para acciones masivas"}
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <caption className="sr-only">
            Tabla de historial de guardias con selección, estado y acciones de
            edición o eliminación.
          </caption>
          <thead className="bg-slate-100/80 text-xs uppercase tracking-[0.08em] text-slate-600">
            <tr>
              {!readonly && (
                <th scope="col" className="px-4 py-3">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all"
                      type="checkbox"
                      className="h-4 w-4 rounded-sm border-slate-300 bg-white text-rose-600 focus:ring-2 focus:ring-rose-300"
                      data-tooltip-id="checkbox-all-tooltip"
                      aria-label="Seleccionar todas las guardias"
                      checked={allSelected}
                      onChange={(event) => {
                        handleSelectAllChange(event.target.checked);
                      }}
                    />
                    <Tooltip
                      id="checkbox-all-tooltip"
                      content="Seleccionar Todos"
                      className="font-normal capitalize"
                    />
                    <label htmlFor="checkbox-all" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </th>
              )}
              {customHeaders.map((header) => (
                <th key={header.id} scope="col" className="px-4 py-3">
                  {header.label}
                </th>
              ))}
              {!readonly && (
                <th scope="col" className="px-4 py-3 text-right">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <EmptyTableRow
              isListEmpty={!guards.length}
              colSpan={customHeaders.length + (readonly ? 0 : 2)}
            />
            {guards?.map((guard) => (
              <tr
                key={guard.id}
                className="border-b border-slate-200 transition-colors hover:bg-slate-50/70"
              >
                {!readonly && (
                  <td className="w-4 p-4">
                    <TableCheckbox
                      id={`checkbox-table-${guard.id}`}
                      checked={selectedIds.includes(guard.id)}
                      ariaLabel={`Seleccionar guardia de ${guard.guardChief?.name || "sin jefe"} con fecha ${formatDateToDDMMYYYY(guard.date)}`}
                      onChange={(checked) =>
                        handleCheckboxChange(guard.id, checked)
                      }
                    />
                  </td>
                )}
                <th
                  scope="row"
                  className="whitespace-nowrap px-4 py-3.5 font-medium text-slate-900"
                >
                  {guard.guardChief?.name}
                </th>
                <td className="px-4 py-3.5">
                  {formatDateToDDMMYYYY(guard.date)}
                </td>
                <td className="px-4 py-3.5">{"Turnos"}</td>
                <td className="px-4 py-3.5">
                  <GuardStateShow state={guard.state} />
                </td>
                {!readonly && (
                  <TableActions>
                    <TableActionDetail
                      guard={guard}
                      title="Detalles de la Guardia"
                    />
                    <TableActionEdit
                      editLink={`${route ? route : "/dashboard/guards"}/${
                        guard.id
                      }/edit`}
                    />
                    <TableActionDelete
                      id={guard.id}
                      title="Eliminar Guardia"
                      question="¿Está seguro que desea eliminar la guardia?"
                      actionDelete={deleteGuard}
                    />
                  </TableActions>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination totalItems={totalRecords} />
    </main>
  );
}

export function GuardStateShow({ state }: { state: GuardType["state"] }) {
  const variantMap: Record<
    GuardType["state"],
    "neutral" | "warning" | "success"
  > = {
    Nueva: "neutral",
    "En curso": "warning",
    Cerrada: "success",
  };

  return <Badge title={state} variant={variantMap[state]} />;
}
