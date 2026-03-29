"use client";

import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { DelegationType, SupplyPharmacyType } from "@/app/lib/definitions";
import { deleteSupplyInPharmacy } from "@/app/lib/actions/supply";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import ModalTrigger from "@/app/ui/button-modal";
import TableActionEdit from "@/app/ui/dashboard/botton-edit";
import TableActionDelete from "@/app/ui/dashboard/button-delete";
import TablePagination from "@/app/ui/dashboard/pagination";
import TableActions from "@/app/ui/dashboard/tabla-actions";
import Filters from "@/app/ui/dashboard/table-filters";
import TableActionDeleteAllSelected from "@/app/ui/dashboard/button-delete-all";
import { SearchPharmacieSupplies } from "@/app/ui/dashboard/search";
import { modalComponents } from "@/app/lib/config/modalConfig";

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
  data: [SupplyPharmacyType[], DelegationType[], string];
}) {
  const [supplies, delegations, pharmacyId] = data;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
              //TODO: Implement bulk delete action
              console.log(ids, "TODO: Implement bulk delete action");
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
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-100/80 text-xs uppercase text-slate-600">
            <tr>
              <th scope="col" className="px-4 py-3">
                <div className="flex items-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    data-tooltip-id="checkbox-all-tooltip"
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
              <th
                scope="col"
                className="px-4 py-3 flex items-center justify-end"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {!supplies.length && (
              <tr className="relative h-10">
                <td className="absolute top-0 left-0 px-10">
                  No hay elementos para mostrar.
                </td>
              </tr>
            )}
            {supplies?.map((supply) => (
              <tr key={supply.id} className="border-b border-slate-200">
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-${supply.id}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      value={supply.id}
                      checked={selectedIds.includes(supply.id)}
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
                  className="whitespace-nowrap px-4 py-3 font-medium text-slate-900"
                >
                  {supply.category}
                </th>
                <td className="px-4 py-3">{supply.specification}</td>
                <td className="px-4 py-3">
                  {formatDateToDDMMYYYY(supply.expiration_date)}
                </td>
                <td className="px-4 py-3">{supply.avaible_quantity}</td>
                <td className="px-4 py-3">
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
      <TablePagination totalItems={supplies.length} />
    </main>
  );
}
