"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  AmbulanceType,
  CustomOptions,
  DelegationType,
  GuardType,
} from "@/app/lib/definitions";
import { deleteGuard } from "@/app/lib/actions/guard";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import ModalTrigger from "@/app/ui/button-modal";
import TableActions from "@/app/ui/dashboard/tabla-actions";
import TablePagination from "@/app/ui/dashboard/pagination";
import Filters from "@/app/ui/dashboard/table-filters";
import TableActionDelete from "@/app/ui/dashboard/button-delete";
import TableActionEdit from "@/app/ui/dashboard/botton-edit";
import GuardForm from "@/app/ui/dashboard/guards/create/guard-form";
import TableActionDeleteAllSelected from "@/app/ui/dashboard/button-delete-all";

const customHeaders = [
  { id: 0, label: "Jefe de Guardia" },
  { id: 1, label: "Fecha" },
  { id: 2, label: "Ambulancias" },
  { id: 3, label: "Estado" },
];

export default function GuardsTable({
  data,
}: {
  data: [
    GuardType[],
    AmbulanceType[],
    DelegationType[],
    [CustomOptions[], CustomOptions[], CustomOptions[]]
  ];
}) {
  // (Component) Lista de guardias existentes - [CSR]

  const [
    guards,
    ambulances,
    delegations,
    [guardChiefs, drivers, paramedicals],
  ] = data;
  const customAmbulances = ambulances.map<CustomOptions>(({ id, number }) => ({
    id,
    label: number,
    value: id,
  }));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function handleCheckboxChange(checkedId: string, checked: boolean) {
    if (checked) {
      setSelectedIds([...selectedIds, checkedId]);
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== checkedId));
    }
  }

  function handleSelectAllChange(checked: boolean) {
    const guardsIdArray = guards.map(({ id }) => id);
    setSelectedIds(checked ? guardsIdArray : []);
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
          title="Crear Guardia"
          modelContent={
            <GuardForm
              guardChiefs={guardChiefs}
              delegations={delegations}
              ambulances={customAmbulances}
              drivers={drivers}
              paramedicals={paramedicals}
            />
          }
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
            {guards?.map((guard) => (
              <tr key={guard.id} className="border-b dark:border-gray-700">
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-${guard.id}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      value={guard.id}
                      checked={selectedIds.includes(guard.id)}
                      onChange={(event) => {
                        handleCheckboxChange(guard.id, event.target.checked);
                      }}
                    />
                    <label
                      htmlFor={`checkbox-table-${guard.id}`}
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
                  {guard.guardChief?.name}
                </th>
                <td className="px-4 py-3">
                  {formatDateToDDMMYYYY(guard.date)}
                </td>
                <td className="px-4 py-3">{"Turnos"}</td>
                <td className="px-4 py-3">
                  <GuardStateShow state={guard.state} />
                </td>
                <TableActions>
                  <TableActionEdit
                    editLink={`/dashboard/guards/${guard.id}/edit`}
                  />
                  <TableActionDelete id={guard.id} actionDelete={deleteGuard} />
                </TableActions>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination totalItems={guards.length} />
    </main>
  );
}

export function GuardStateShow({ state }: { state: GuardType["state"] }) {
  const customGuardsStates = {
    customStates: [
      { label: "Nueva", bgColor: "bg-green-500" },
      { label: "En curso", bgColor: "bg-orange-500" },
      { label: "Cerrada", bgColor: "bg-red-500" },
    ],
    get(state: string) {
      return this.customStates.find(({ label }) => label === state);
    },
  };

  const guardState = customGuardsStates.get(state);

  return (
    <span
      className={clsx(
        "inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full",
        {
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300":
            guardState?.bgColor === "bg-green-500",
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300":
            guardState?.bgColor === "bg-orange-500",
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300":
            guardState?.bgColor === "bg-red-500",
        }
      )}
    >
      <span
        className={clsx("w-2 h-2 me-1 bg-green-500 rounded-full", {
          [`${guardState?.bgColor}`]: guardState?.bgColor,
        })}
      ></span>
      {guardState?.label}
    </span>
  );
}
