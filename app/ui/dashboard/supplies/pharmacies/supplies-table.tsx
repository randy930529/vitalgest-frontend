"use client";

import { useState } from "react";
import { Tooltip } from "react-tooltip";
import {
  DelegationType,
  PaginatedResult,
  SupplyPharmacyType,
} from "@/app/lib/definitions";
import { deleteSupplyInPharmacy } from "@/app/lib/actions/supply";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import ModalTrigger from "@/app/ui/button-modal";
import TableActionEdit from "@/app/ui/dashboard/botton-edit";
import TableActionDelete from "@/app/ui/dashboard/button-delete";
import TablePagination from "@/app/ui/components/pagination";
import TableActions from "@/app/ui/dashboard/tabla-actions";
import Filters from "@/app/ui/dashboard/table-filters";
import TableActionDeleteAllSelected from "@/app/ui/dashboard/button-delete-all";
import { SearchPharmacieSupplies } from "@/app/ui/dashboard/search";
import { modalComponents } from "@/app/lib/config/modalConfig";
import { runBulkDeleteWithFeedback } from "@/app/lib/bulk-delete-feedback";

const ModalComponent = modalComponents.supplyPharmacyForm;
const customHeaders = [
  { id: 0, label: "Categoría" },
  { id: 1, label: "Especificación" },
  { id: 2, label: "Fecha de Caducidad" },
  { id: 3, label: "Cantidad" },
  { id: 4, label: "Fecha de entrada" },
  // { id: 5, label: "Registrado por" },
];

export default function PharmacySuppliesTable({
  data,
}: {
  data: [PaginatedResult<SupplyPharmacyType>, DelegationType[], string];
}) {
  const [{ data: supplies, totalRecords }, delegations, pharmacyId] = data;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const allSelected =
    supplies.length > 0 && selectedIds.length === supplies.length;

  function handleCheckboxChange(checkedId: string, checked: boolean) {
    if (checked) {
      setSelectedIds([...selectedIds, checkedId]);
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== checkedId));
    }
  }

  function handleSelectAllChange(checked: boolean) {
    const ambulanceArray = supplies.map(({ id }) => id);
    setSelectedIds(checked ? ambulanceArray : []);
  }

  async function handleDelete(id: string) {
    return await deleteSupplyInPharmacy(id, pharmacyId);
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
                deleteAction: handleDelete,
                setFailedSelection: setSelectedIds,
                pluralLabel: "insumo(s)",
                singularLabel: "el insumo",
              });
            }}
          />
        )}
        <SearchPharmacieSupplies
          delegations={delegations}
          pharmacyId={pharmacyId}
        />
        <ModalTrigger
          title="Crear Insumo"
          modelContent={
            <ModalComponent pharmacyId={pharmacyId} delegations={delegations} />
          }
        />
      </Filters>
      <p className="px-4 py-2 text-xs text-slate-500" aria-live="polite">
        {selectedIds.length > 0
          ? `${selectedIds.length} insumo(s) seleccionado(s)`
          : "Selecciona insumos para acciones masivas"}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <caption className="sr-only">
            Tabla de insumos en farmacia con selección y acciones de edición o
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
                    aria-label="Seleccionar todos los insumos de farmacia"
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
            {!supplies.length && (
              <tr>
                <td
                  className="px-4 py-4 text-slate-500"
                  colSpan={customHeaders.length + 2}
                >
                  No hay elementos para mostrar.
                </td>
              </tr>
            )}
            {supplies?.map((supply) => (
              <tr
                key={supply.id}
                className="border-b border-slate-200 transition-colors hover:bg-slate-50/70"
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-${supply.id}`}
                      type="checkbox"
                      className="h-4 w-4 rounded-sm border-slate-300 bg-white text-rose-600 focus:ring-2 focus:ring-rose-300"
                      value={supply.id}
                      checked={selectedIds.includes(supply.id)}
                      aria-label={`Seleccionar insumo ${supply.category}`}
                      onChange={(event) => {
                        handleCheckboxChange(supply.id, event.target.checked);
                      }}
                    />
                    <label
                      htmlFor={`checkbox-table-${supply.id}`}
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
                  {supply.category}
                </th>
                <td className="px-4 py-3.5">{supply.specification}</td>
                <td className="px-4 py-3.5">
                  {formatDateToDDMMYYYY(supply.expiration_date)}
                </td>
                <td className="px-4 py-3.5">{supply.avaible_quantity}</td>
                <td className="px-4 py-3.5">
                  {formatDateToDDMMYYYY(supply.createdAt)}
                </td>
                {/* <td className="px-4 py-3">usuario del registro</td> */}
                <TableActions>
                  <TableActionEdit
                    editLink={`/dashboard/supplies/pharmacies/${supply.id}/edit`}
                  />
                  <TableActionDelete
                    id={supply.id}
                    title="Eliminar Insumo"
                    question={`¿Está seguro que desea eliminar el insumo: ${supply.category}?`}
                    actionDelete={handleDelete}
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
