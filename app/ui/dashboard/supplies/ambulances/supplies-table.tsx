"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tooltip } from "react-tooltip";
import {
  AmbulanceAreaType,
  AmbulanceType,
  DelegationType,
  PaginatedResult,
  SupplyAmbulanceType,
  SupplyPharmacyType,
} from "@/app/lib/definitions";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import { deleteSupplyInAmbulance } from "@/app/lib/actions/supply";
import { runBulkDeleteWithFeedback } from "@/app/lib/bulk-delete-feedback";
import { modalComponents } from "@/app/lib/config/modalConfig";
import { Badge } from "@/app/ui/components/badges";
import ModalTrigger from "@/app/ui/button-modal";
import TableActionEdit from "@/app/ui/dashboard/botton-edit";
import TableActionDelete from "@/app/ui/dashboard/button-delete";
import TablePagination from "@/app/ui/components/pagination";
import TableActions from "@/app/ui/dashboard/tabla-actions";
import Filters from "@/app/ui/dashboard/table-filters";
import TableActionDeleteAllSelected from "@/app/ui/dashboard/button-delete-all";
import { SearchAmbulanceSupplies } from "@/app/ui/dashboard/search";

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
    PaginatedResult<SupplyAmbulanceType>,
    string,
    AmbulanceAreaType[],
    SupplyPharmacyType[],
    DelegationType[],
  ];
}) {
  const [
    ambulances,
    { data: suppliesAmbulance, totalRecords },
    ambulanceId,
    areas,
    suppliesPharmacy,
    delegations,
  ] = data;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const allSelected =
    suppliesAmbulance.length > 0 &&
    selectedIds.length === suppliesAmbulance.length;
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
      <p className="px-4 py-2 text-xs text-slate-500" aria-live="polite">
        {selectedIds.length > 0
          ? `${selectedIds.length} insumo(s) seleccionado(s)`
          : "Selecciona insumos para acciones masivas"}
      </p>
      <div ref={tableWrapperRef} className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <caption className="sr-only">
            Tabla de insumos en ambulancia con selección y acciones de edición o
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
                    aria-label="Seleccionar todos los insumos de ambulancia"
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
            {!suppliesAmbulance.length && (
              <tr>
                <td
                  className="px-4 py-4 text-slate-500"
                  colSpan={customHeaders.length + 2}
                >
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
                  {areas.find(({ id }) => Number(id) === supply.area_id)
                    ?.name || ""}
                </td>
                <td className="px-4 py-3.5">
                  {formatDateToDDMMYYYY(supply.expiration_date)}
                </td>
                {supply.avaible_quantity < supply.min_quantity ? (
                  <td
                    className="px-4 py-3.5"
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
                  <td className="px-4 py-3.5">{supply.avaible_quantity}</td>
                )}
                <td className="px-4 py-3.5">{supply.min_quantity}</td>
                <td className="px-4 py-3.5">
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
      <TablePagination totalItems={totalRecords} />
    </main>
  );
}
