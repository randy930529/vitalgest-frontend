"use client";

import clsx from "clsx";
import { Tooltip } from "react-tooltip";
import {
  CustomMxState,
  DelegationType,
  PaginatedResult,
} from "@/app/lib/definitions";
import { useTableSelection } from "@/app/lib/hooks/useTableSelection";
import { modalComponents } from "@/app/lib/config/modalConfig";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import { STYLES } from "@/app/lib/config/constants";
import { deleteDelegation } from "@/app/lib/actions/delegation";
import ModalTrigger from "@/app/ui/button-modal";
import TableActions from "@/app/ui/dashboard/tabla-actions";
import TablePagination from "@/app/ui/components/pagination";
import Filters from "@/app/ui/dashboard/table-filters";
import TableActionDeleteAllSelected from "@/app/ui/dashboard/button-delete-all";
import TableActionDelete from "@/app/ui/dashboard/button-delete";
import TableActionEdit from "@/app/ui/dashboard/botton-edit";
import { runBulkDeleteWithFeedback } from "@/app/lib/bulk-delete-feedback";
import EmptyTableRow from "@/app/ui/components/empty-table-row";
import TableCheckbox from "@/app/ui/dashboard/table-checkbox";

const ModalComponent = modalComponents.delegationForm;
const customHeaders = [
  { id: 0, label: "Estado" },
  { id: 1, label: "Municipio" },
  // { id: 2, label: "Registrado por" },
  { id: 3, label: "Fecha de Registro" },
];

export default function DelegationTable({
  data,
}: {
  data: [PaginatedResult<DelegationType>, CustomMxState[]];
}) {
  // (Component) Lista de delegaciones existentes - [CSR]

  const [{ data: delegations, totalRecords }, customMxStates] = data;
  const {
    selectedIds,
    setSelectedIds,
    allSelected,
    handleCheckboxChange,
    handleSelectAllChange,
  } = useTableSelection(delegations);

  return (
    <main className={clsx(STYLES.mainTable)}>
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
            <EmptyTableRow
              isListEmpty={!delegations.length}
              colSpan={customHeaders.length + 2}
            />
            {delegations?.map((delegation) => (
              <tr
                key={delegation.id}
                className="border-b border-slate-200 transition-colors hover:bg-slate-50/70"
              >
                <td className="w-4 p-4">
                  <TableCheckbox
                    id={`checkbox-table-${delegation.id}`}
                    checked={selectedIds.includes(delegation.id)}
                    ariaLabel={`Seleccionar delegación ${delegation.name}`}
                    onChange={(checked) =>
                      handleCheckboxChange(delegation.id, checked)
                    }
                  />
                </td>
                <th
                  scope="row"
                  className="whitespace-nowrap px-4 py-3.5 font-medium text-slate-900"
                >
                  {delegation.name}
                </th>
                <td className="px-4 py-3.5">{delegation.municipality?.name}</td>
                {/*<td className="px-4 py-3.5">{delegation.userToRegister}</td>*/}
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
      <TablePagination totalItems={totalRecords} />
    </main>
  );
}
