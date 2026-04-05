"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tooltip } from "react-tooltip";
import {
  AmbulanceAreaType,
  AmbulanceType,
  DelegationType,
  SupplyAmbulanceType,
  SupplyPharmacyType,
} from "@/app/lib/definitions";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import { deleteSupplyInAmbulance } from "@/app/lib/actions/supply";
import { Badge } from "@/app/ui/badges";
import ModalTrigger from "@/app/ui/button-modal";
import TableActionEdit from "@/app/ui/dashboard/botton-edit";
import TableActionDelete from "@/app/ui/dashboard/button-delete";
import TablePagination from "@/app/ui/dashboard/pagination";
import TableActions from "@/app/ui/dashboard/tabla-actions";
import Filters from "@/app/ui/dashboard/table-filters";
import TableActionDeleteAllSelected from "@/app/ui/dashboard/button-delete-all";
import { SearchAmbulanceSupplies } from "@/app/ui/dashboard/search";
import { modalComponents } from "@/app/lib/config/modalConfig";

const ModalComponent = modalComponents.supplyAmbulanceForm;
const customHeaders = [
  { id: 0, label: "Categoría" },
  { id: 1, label: "Especificación" },
  { id: 2, label: "Área" },
  { id: 3, label: "Fecha de Caducidad" },
  { id: 4, label: "Cantidad" },
  { id: 5, label: "Cantidad Mínima" },
  { id: 6, label: "Fecha de entrada" },
  // { id: 6, label: "Registrado por" },
];

export default function AmbulanceSuppliesTable({
  data,
}: {
  data: [
    AmbulanceType[],
    SupplyAmbulanceType[],
    string,
    AmbulanceAreaType[],
    SupplyPharmacyType[],
    DelegationType[],
  ];
}) {
  const [
    ambulances,
    suppliesAmbulance,
    ambulanceId,
    areas,
    suppliesPharmacy,
    delegations,
  ] = data;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [animateHighlightedRow, setAnimateHighlightedRow] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const highlightedSupplyId = searchParams.get("supply");
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!highlightedSupplyId || !tableWrapperRef.current) return;

    const row = tableWrapperRef.current.querySelector<HTMLTableRowElement>(
      `tr[data-supply-row="${highlightedSupplyId}"]`,
    );

    if (!row) return;

    row.scrollIntoView({ behavior: "smooth", block: "center" });

    setAnimateHighlightedRow(true);
    const timer = window.setTimeout(() => {
      setAnimateHighlightedRow(false);

      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.delete("supply");
      const nextQuery = nextParams.toString();
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      router.replace(nextUrl, { scroll: false });
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [highlightedSupplyId, pathname, router, searchParams]);

  function handleCheckboxChange(checkedId: string, checked: boolean) {
    if (checked) {
      setSelectedIds([...selectedIds, checkedId]);
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== checkedId));
    }
  }

  function handleSelectAllChange(checked: boolean) {
    const supplyArray = suppliesAmbulance.map(({ id }) => id);
    setSelectedIds(checked ? supplyArray : []);
  }

  async function handleDelete(id: string) {
    return await deleteSupplyInAmbulance(id, ambulanceId);
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
        <SearchAmbulanceSupplies
          ambulances={ambulances}
          ambulanceId={ambulanceId}
          delegations={delegations}
        />
        <ModalTrigger
          title="Crear Insumo"
          modelContent={
            <ModalComponent
              ambulanceId={ambulanceId}
              ambulances={ambulances}
              areas={areas}
              suppliesPharmacy={suppliesPharmacy}
            />
          }
        />
      </Filters>
      <div ref={tableWrapperRef} className="overflow-x-auto">
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
            {!suppliesAmbulance.length && (
              <tr className="relative h-10">
                <td className="absolute top-0 left-0 px-10">
                  No hay elementos para mostrar.
                </td>
              </tr>
            )}
            {suppliesAmbulance?.map((supply) => (
              <tr
                key={supply.id}
                data-supply-row={supply.id}
                className={`border-b border-slate-200 ${
                  highlightedSupplyId === supply.id
                    ? `bg-rose-50/60 ring-1 ring-inset ring-rose-200 ${
                        animateHighlightedRow
                          ? "animate-[pulse_1s_ease-in-out_2]"
                          : ""
                      }`
                    : ""
                }`}
              >
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
                  {areas.find(({ id }) => Number(id) === supply.area_id)
                    ?.name || ""}
                </td>
                <td className="px-4 py-3">
                  {formatDateToDDMMYYYY(supply.expiration_date)}
                </td>
                {supply.avaible_quantity < supply.min_quantity ? (
                  <td
                    className="px-4 py-3"
                    data-tooltip-id="checkbox-avaibleQuantity-tooltip"
                  >
                    <Badge title={String(supply.avaible_quantity)} pending />
                    <Tooltip
                      id="checkbox-avaibleQuantity-tooltip"
                      content="¡Insumo faltante!"
                      className="font-normal capitalize"
                    />
                  </td>
                ) : (
                  <td className="px-4 py-3">{supply.avaible_quantity}</td>
                )}
                <td className="px-4 py-3">{supply.min_quantity}</td>
                <td className="px-4 py-3">
                  {formatDateToDDMMYYYY(supply.createdAt)}
                </td>
                {/* <td className="px-4 py-3">usuario del registro</td> */}
                <TableActions>
                  <TableActionEdit
                    editLink={`/dashboard/supplies/ambulances/${supply.id}/edit`}
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
      <TablePagination totalItems={suppliesAmbulance.length} />
    </main>
  );
}
