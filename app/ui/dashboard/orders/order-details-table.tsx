"use client";

import Link from "next/link";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import clsx from "clsx";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { OrderSupplyType, OrderType } from "@/app/lib/definitions";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import { customUnits } from "@/app/lib/config/selectOptions";
import { STYLES } from "@/app/lib/config/constants";
import EmptyTableRow from "@/app/ui/components/empty-table-row";

const customHeaders = [
  { id: 0, label: "Insumo" },
  { id: 1, label: "Especificación" },
  { id: 2, label: "Cantidad" },
  { id: 3, label: "Pedido" },
  { id: 4, label: "Notas" },
];

export default function OrderDetailsTable({
  data,
}: {
  data: OrderType | undefined;
}) {
  if (!data) notFound();

  const ordersMap = new Map<string, OrderSupplyType[]>();
  data.areas.forEach((area) => {
    const existingSupplies = ordersMap.get(area.area_name) || [];
    const updatedSupplies = [...existingSupplies, ...area.supplies];
    ordersMap.set(area.area_name, updatedSupplies);
  });

  return (
    <main className={clsx(STYLES.mainTable)}>
      <div className="flex flex-col gap-3 border-b border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,1))] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Detalles del pedido
          </h2>
          <dl className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 sm:gap-x-8">
            <div>
              <dt className="inline font-semibold text-slate-900">Fecha: </dt>
              <dd className="inline">{formatDateToDDMMYYYY(data.createdAt)}</dd>
            </div>
            <div>
              <dt className="inline font-semibold text-slate-900">
                Ambulancia:{" "}
              </dt>
              <dd className="inline">{data.ambulance.number}</dd>
            </div>
          </dl>
        </div>
        <Link
          href="/dashboard/orders"
          className="inline-flex w-fit rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Volver a pedidos
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <caption className="sr-only">
            Insumos solicitados en el pedido seleccionado.
          </caption>
          <thead className="bg-slate-100/80 text-xs uppercase tracking-[0.08em] text-slate-600">
            <tr>
              {customHeaders.map((header) => (
                <th key={header.id} scope="col" className="px-4 py-3">
                  {header.label}
                </th>
              ))}
              {/* Area de Acciones */}
            </tr>
          </thead>
          <tbody>
            <EmptyTableRow
              isListEmpty={!data.areas.length}
              colSpan={customHeaders.length}
              message="No hay insumos en este pedido."
            />
            <OrderDetailRow ordersMap={ordersMap} />
          </tbody>
        </table>
      </div>
    </main>
  );
}

function OrderDetailRow({
  ordersMap,
}: {
  ordersMap: Map<string, OrderSupplyType[]>;
}) {
  return (
    <>
      {Array.from(ordersMap.keys()).map((areaName, index) => (
        <Fragment key={index + areaName}>
          <tr className="border-b border-slate-200 transition-colors hover:bg-slate-50/70">
            <th
              scope="row"
              colSpan={customHeaders.length}
              className="px-4 py-3.5 font-medium bg-gray-700 text-white uppercase rounded-t-md"
            >
              {areaName}
            </th>
          </tr>
          {ordersMap.get(areaName)?.map((orderDetail) => {
            const umLabel =
              customUnits.find(
                ({ value }) => value === orderDetail.measurement_unit,
              )?.label || orderDetail.measurement_unit;

            return (
              <tr key={orderDetail.id}>
                <td className="px-4 py-3.5">{orderDetail.category}</td>
                <td className="px-4 py-3.5">{orderDetail.specification}</td>
                <td className="px-4 py-3.5">
                  {`${orderDetail.reported_quantity} ${umLabel}`}
                </td>
                <td className="px-4 py-3.5">
                  {`${orderDetail.required_quantity} ${umLabel}`}
                </td>
                <td className="px-4 py-3.5">{orderDetail.notes}</td>
              </tr>
            );
          })}
        </Fragment>
      ))}
    </>
  );
}
