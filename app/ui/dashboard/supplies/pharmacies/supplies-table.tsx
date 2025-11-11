"use client";

import { useState } from "react";
import { SupplyType } from "@/app/lib/definitions";
import ModalTrigger from "@/app/ui/button-modal";
import TableActionEdit from "../../botton-edit";
import TableActionDelete from "../../button-delete";
import TableActionDeleteAllSelected from "../../button-delete-all";
import TablePagination from "../../pagination";
import TableActions from "../../tabla-actions";
import Filters from "../../table-filters";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import SupplyForm from "./create/supply-form";

const customHeaders = [
  { id: 0, label: "Categoría" },
  { id: 1, label: "Especificación" },
  { id: 2, label: "Fecha de Caducidad" },
  { id: 3, label: "Cantidad" },
  { id: 4, label: "Fecha de entrada" },
  { id: 5, label: "Registrado por" },
  { id: 6, label: "Fecha de modificación" },
  { id: 7, label: "Modificado por" },
  { id: 8, label: "Notas" },
];

export default function SuppliesTable({
  data: supplies,
}: {
  data: SupplyType[];
}) {
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
  return (
    <main className="bg-white mt-7 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
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
        <ModalTrigger
          title="Crear Insumo"
          modelContent={<SupplyForm pharmacyId="" />}
        />
      </Filters>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">
                <div className="flex items-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={(event) => {
                      handleSelectAllChange(event.target.checked);
                    }}
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
            {supplies?.map((supply) => (
              <tr key={supply.id} className="border-b dark:border-gray-700">
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
                  className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {supply.category}
                </th>
                <td className="px-4 py-3">{supply.specification}</td>
                <td className="px-4 py-3">
                  {formatDateToDDMMYYYY(supply.expiration_date)}
                </td>
                <td className="px-4 py-3">{supply.avialble_quantity}</td>
                <td className="px-4 py-3">
                  {formatDateToDDMMYYYY(supply.createdAt)}
                </td>
                <td className="px-4 py-3">{/* usuario del registro */}</td>
                <td className="px-4 py-3">
                  {formatDateToDDMMYYYY(supply.updatedAt)}
                </td>
                <td className="px-4 py-3">{/* usuario que modifica */}</td>
                <td className="px-4 py-3">{/* notas */}</td>
                <TableActions>
                  <TableActionEdit
                    editLink={`/dashboard/ambulances/${supply.id}/edit`}
                  />
                  {/* <TableActionDelete
                    id={supply.id}
                    actionDelete={deleteAmbulance}
                  /> */}
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
