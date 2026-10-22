"use client";

import clsx from "clsx";
import Link from "next/link";
import { OrderType } from "@/app/lib/definitions";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import EmptyTableRow from "@/app/ui/components/empty-table-row";
import { STYLES } from "@/app/lib/config/constants";
import { notFound } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function OrderDetailsTable({
  data,
}: {
  data: OrderType | undefined;
}) {
  if (!data) notFound();

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
              <dd className="inline">{formatDateToDDMMYYYY(data.date)}</dd>
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
              <th scope="col" className="px-4 py-3">
                Categoría
              </th>
              <th scope="col" className="px-4 py-3">
                Especificación
              </th>
              <th scope="col" className="px-4 py-3">
                Cantidad
              </th>
              <th scope="col" className="px-4 py-3">
                Notas
              </th>
            </tr>
          </thead>
          <tbody>
            <EmptyTableRow
              isListEmpty={!data.details.length}
              colSpan={4}
              message="No hay insumos en este pedido."
            />
            {data.details.map((detail) => (
              <tr
                key={detail.id}
                className="border-b border-slate-200 transition-colors hover:bg-slate-50/70"
              >
                <th
                  scope="row"
                  className="px-4 py-3.5 font-medium text-slate-900"
                >
                  {detail.category}
                </th>
                <td className="px-4 py-3.5">{detail.specification}</td>
                <td className="px-4 py-3.5">{detail.quantity}</td>
                <td className="px-4 py-3.5">{detail.notes || "Sin notas"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
