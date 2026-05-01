"use client";

import { useState } from "react";
import { Tooltip } from "react-tooltip";
import {
  AmbulanceType,
  DelegationType,
  PaginatedResult,
} from "@/app/lib/definitions";
import { deleteAmbulance } from "@/app/lib/actions/ambulance";
import ModalTrigger from "@/app/ui/button-modal";
import Filters from "@/app/ui/dashboard/table-filters";
import TablePagination from "@/app/ui/components/pagination";
import TableActions from "@/app/ui/dashboard/tabla-actions";
import TableActionEdit from "@/app/ui/dashboard/botton-edit";
import TableActionDelete from "@/app/ui/dashboard/button-delete";
import TableActionDeleteAllSelected from "@/app/ui/dashboard/button-delete-all";
import { modalComponents } from "@/app/lib/config/modalConfig";
import { runBulkDeleteWithFeedback } from "@/app/lib/bulk-delete-feedback";

const ModalComponent = modalComponents.ambulanceForm;
const customHeaders = [
  { id: 0, label: "Numero" },
  { id: 1, label: "Marca" },
  { id: 2, label: "Modelo" },
  { id: 3, label: "Delegación" },
];

export default function AmbulanceTable({
  data,
}: {
  data: [PaginatedResult<AmbulanceType>, DelegationType[]];
}) {
  // (Component) Tabla interactiva de ambulancias - [CSR]

  const [{ data: ambulances, totalRecords }, delegations] = data;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const allSelected =
    ambulances.length > 0 && selectedIds.length === ambulances.length;

  function handleCheckboxChange(checkedId: string, checked: boolean) {
    if (checked) {
      setSelectedIds([...selectedIds, checkedId]);
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== checkedId));
    }
  }

  function handleSelectAllChange(checked: boolean) {
    const ambulanceArray = ambulances.map(({ id }) => id);
    setSelectedIds(checked ? ambulanceArray : []);
  }

  return (
    <main className="relative mt-7 overflow-hidden rounded-[26px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm">
      <Filters>
        {selectedIds.length > 0 && (
          <TableActionDeleteAllSelected
            selectedIds={selectedIds}
            actionDelete={async (ids: string[]) => {
              return runBulkDeleteWithFeedback({
                ids,
                deleteAction: deleteAmbulance,
                setFailedSelection: setSelectedIds,
                pluralLabel: "ambulancia(s)",
                singularLabel: "la ambulancia",
              });
            }}
          />
        )}
        <ModalTrigger
          title="Crear Ambulancia"
          modelContent={<ModalComponent delegations={delegations} />}
        />
      </Filters>
      <p className="px-4 py-2 text-xs text-slate-500" aria-live="polite">
        {selectedIds.length > 0
          ? `${selectedIds.length} ambulancia(s) seleccionada(s)`
          : "Selecciona ambulancias para acciones masivas"}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <caption className="sr-only">
            Tabla de ambulancias con selección y acciones de edición o
            eliminación.
          </caption>
          <thead className="bg-slate-100/80 text-xs uppercase tracking-[0.08em] text-slate-600">
            <tr>
              <th scope="col" className="px-4 py-3">
                <div className="flex items-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    className="h-4 w-4 rounded-sm border-slate-300 bg-white text-rose-600 focus:ring-2 focus:ring-rose-300"
                    data-tooltip-id="checkbox-all-tooltip"
                    checked={allSelected}
                    aria-label="Seleccionar todas las ambulancias"
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
              {customHeaders.map((header) => (
                <th key={header.id} scope="col" className="px-4 py-3">
                  {header.label}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {ambulances?.map((ambulance) => (
              <tr
                key={ambulance.id}
                className="border-b border-slate-200 transition-colors hover:bg-slate-50/70"
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-${ambulance.id}`}
                      type="checkbox"
                      className="h-4 w-4 rounded-sm border-slate-300 bg-white text-rose-600 focus:ring-2 focus:ring-rose-300"
                      value={ambulance.id}
                      checked={selectedIds.includes(ambulance.id)}
                      aria-label={`Seleccionar ambulancia ${ambulance.number}`}
                      onChange={(event) => {
                        handleCheckboxChange(
                          ambulance.id,
                          event.target.checked,
                        );
                      }}
                    />
                    <label
                      htmlFor={`checkbox-table-${ambulance.id}`}
                      className="sr-only"
                    >
                      checkbox
                    </label>
                  </div>
                </td>
                <th
                  scope="row"
                  className="whitespace-nowrap px-4 py-3.5 font-medium text-slate-900"
                >
                  {ambulance.number}
                </th>
                <td className="px-4 py-3.5">{ambulance.brand}</td>
                <td className="px-4 py-3.5">{ambulance.model}</td>
                <td className="px-4 py-3.5">{ambulance.delegation?.name}</td>
                <TableActions>
                  <TableActionEdit
                    editLink={`/dashboard/ambulances/${ambulance.id}/edit`}
                  />
                  <TableActionDelete
                    id={ambulance.id}
                    title="Eliminar Ambulancia"
                    question={`¿Está seguro que desea eliminar la ambulancia: ${ambulance.number}?`}
                    actionDelete={deleteAmbulance}
                  />
                </TableActions>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination totalItems={totalRecords} />
    </main>
  );
}
