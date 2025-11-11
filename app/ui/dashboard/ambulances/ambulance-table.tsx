"use client";

import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { AmbulanceType, DelegationType } from "@/app/lib/definitions";
import { deleteAmbulance } from "@/app/lib/actions/ambulance";
import ModalTrigger from "@/app/ui/button-modal";
import Filters from "@/app/ui/dashboard/table-filters";
import TablePagination from "@/app/ui/dashboard/pagination";
import TableActions from "@/app/ui/dashboard/tabla-actions";
import TableActionEdit from "@/app/ui/dashboard/botton-edit";
import TableActionDelete from "@/app/ui/dashboard/button-delete";
import TableActionDeleteAllSelected from "@/app/ui/dashboard/button-delete-all";
import AmbulanceForm from "@/app/ui/dashboard/ambulances/create/ambulance-form";

const customHeaders = [
  { id: 0, label: "Numero" },
  { id: 1, label: "Marca" },
  { id: 2, label: "Modelo" },
  { id: 3, label: "Delegación" },
];

export default function AmbulanceTable({
  data,
}: {
  data: [AmbulanceType[], DelegationType[]];
}) {
  // (Component) Tabla interactiva de ambulancias - [CSR]

  const [ambulances, delegatios] = data;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
          title="Crear Ambulancia"
          modelContent={<AmbulanceForm delegations={delegatios} />}
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
            {ambulances?.map((ambulance) => (
              <tr key={ambulance.id} className="border-b dark:border-gray-700">
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-${ambulance.id}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      value={ambulance.id}
                      checked={selectedIds.includes(ambulance.id)}
                      onChange={(event) => {
                        handleCheckboxChange(
                          ambulance.id,
                          event.target.checked
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
                  className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {ambulance.number}
                </th>
                <td className="px-4 py-3">{ambulance.brand}</td>
                <td className="px-4 py-3">{ambulance.model}</td>
                <td className="px-4 py-3">{ambulance.delegation?.name}</td>
                <TableActions>
                  <TableActionEdit
                    editLink={`/dashboard/ambulances/${ambulance.id}/edit`}
                  />
                  <TableActionDelete
                    id={ambulance.id}
                    actionDelete={deleteAmbulance}
                  />
                </TableActions>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination totalItems={ambulances.length} />
    </main>
  );
}
