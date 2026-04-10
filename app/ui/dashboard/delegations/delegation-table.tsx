"use client";

import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { CustomMxState, DelegationType } from "@/app/lib/definitions";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import ModalTrigger from "@/app/ui/button-modal";
import TableActions from "@/app/ui/dashboard/tabla-actions";
import TablePagination from "@/app/ui/dashboard/pagination";
import Filters from "@/app/ui/dashboard/table-filters";
import TableActionDeleteAllSelected from "@/app/ui/dashboard/button-delete-all";
import TableActionDelete from "@/app/ui/dashboard/button-delete";
import TableActionEdit from "@/app/ui/dashboard/botton-edit";
import { deleteDelegation } from "@/app/lib/actions/delegation";
import { modalComponents } from "@/app/lib/config/modalConfig";
import { runBulkDeleteWithFeedback } from "@/app/lib/bulk-delete-feedback";

const ModalComponent = modalComponents.delegationForm;
const customHeaders = [
  { id: 0, label: "Estado" },
  { id: 1, label: "Municipio" },
  { id: 2, label: "Registrado por" },
  { id: 3, label: "Fecha de Registro" },
];

export default function DelegationTable({
  data,
}: {
  data: [DelegationType[], CustomMxState[]];
}) {
  // (Component) Lista de delegaciones existentes - [CSR]

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [delegations, customMxStates] = data;
  const allSelected =
    delegations.length > 0 && selectedIds.length === delegations.length;

  function handleCheckboxChange(checkedId: string, checked: boolean) {
    if (checked) {
      setSelectedIds([...selectedIds, checkedId]);
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== checkedId));
    }
  }

  function handleSelectAllChange(checked: boolean) {
    const ambulanceArray = delegations.map((r) => r.id);
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
                deleteAction: deleteDelegation,
                setFailedSelection: setSelectedIds,
                pluralLabel: "delegación(es)",
                singularLabel: "la delegación",
              });
            }}
          />
        )}
        <ModalTrigger
          title="Crear Delegación"
          modelContent={<ModalComponent customMxStates={customMxStates} />}
        />
      </Filters>
      <p className="px-4 py-2 text-xs text-slate-500" aria-live="polite">
        {selectedIds.length > 0
          ? `${selectedIds.length} delegación(es) seleccionada(s)`
          : "Selecciona delegaciones para acciones masivas"}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <caption className="sr-only">
            Tabla de delegaciones con selección y acciones de edición o
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
                    aria-label="Seleccionar todas las delegaciones"
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
            {delegations?.map((delegation) => (
              <tr
                key={delegation.id}
                className="border-b border-slate-200 transition-colors hover:bg-slate-50/70"
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-${delegation.id}`}
                      type="checkbox"
                      className="h-4 w-4 rounded-sm border-slate-300 bg-white text-rose-600 focus:ring-2 focus:ring-rose-300"
                      value={delegation.id}
                      checked={selectedIds.includes(delegation.id)}
                      aria-label={`Seleccionar delegación ${delegation.name}`}
                      onChange={(event) => {
                        handleCheckboxChange(
                          delegation.id,
                          event.target.checked,
                        );
                      }}
                    />
                    <label
                      htmlFor={`checkbox-table-${delegation.id}`}
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
                  {delegation.name}
                </th>
                <td className="px-4 py-3.5">{delegation.municipality?.name}</td>
                <td className="px-4 py-3.5">{/*delegation.userToRegister*/}</td>
                <td className="px-4 py-3.5">
                  {formatDateToDDMMYYYY(delegation.createdAt)}
                </td>
                <TableActions>
                  <TableActionEdit
                    editLink={`/dashboard/delegations/${delegation.id}/edit`}
                  />
                  <TableActionDelete
                    id={delegation.id}
                    title="Eliminar Delegación"
                    question={`¿Está seguro que desea eliminar la ${delegation.name}?`}
                    actionDelete={deleteDelegation}
                  />
                </TableActions>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination totalItems={delegations.length} />
    </main>
  );
}
