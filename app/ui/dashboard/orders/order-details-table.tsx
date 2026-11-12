"use client";

import { Fragment } from "react";
import { notFound } from "next/navigation";
import { PencilIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Tooltip } from "react-tooltip";
import { OrderSupplyType, OrderType } from "@/app/lib/definitions";
import { modalComponents } from "@/app/lib/config/modalConfig";
import { customUnits } from "@/app/lib/config/selectOptions";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import { STYLES } from "@/app/lib/config/constants";
import ModalTrigger from "@/app/ui/button-modal";
import TableActions from "@/app/ui/dashboard/tabla-actions";
import EmptyTableRow from "@/app/ui/components/empty-table-row";
import { ButtonFallback } from "@/app/ui/components/buttons";
import { CountBadge } from "@/app/ui/components/badges";

const customHeaders = [
  { id: 0, label: "Insumo" },
  { id: 1, label: "Especificación" },
  { id: 2, label: "Reportado" },
  { id: 3, label: "Pedido" },
];

const ModalComponent = modalComponents.orderEditForm;

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
                {`Ambulancia: `}
              </dt>
              <dd className="inline">{data.ambulance.number}</dd>
            </div>
          </dl>
        </div>
        <ButtonFallback
          title="Volver a pedidos"
          navigateTo={`/dashboard/orders`}
        />
      </div>
      <div className="overflow-x-auto">
        <table className={clsx(STYLES.table)}>
          <caption className="sr-only">
            Insumos solicitados en el pedido seleccionado.
          </caption>
          <thead className={clsx(STYLES.headerTable)}>
            <tr>
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
              isListEmpty={!data.areas.length}
              colSpan={customHeaders.length}
              message="No hay insumos en este pedido."
            />
            <OrderDetailRow orderId={data.id} ordersMap={ordersMap} />
          </tbody>
        </table>
      </div>
    </main>
  );
}

function OrderDetailRow({
  orderId,
  ordersMap,
}: {
  orderId: string;
  ordersMap: Map<string, OrderSupplyType[]>;
}) {
  return (
    <>
      {Array.from(ordersMap.keys()).map((areaName, index) => (
        <Fragment key={index + areaName}>
          <tr className={clsx(STYLES.rowTable)}>
            <th
              scope="row"
              colSpan={customHeaders.length + 1}
              className="px-4 py-3.5 font-medium bg-gray-700 text-white uppercase rounded-t-md"
            >
              {areaName}
            </th>
          </tr>
          {ordersMap
            .get(areaName)
            ?.map(
              ({
                id,
                category,
                specification,
                reported_quantity,
                required_quantity,
                measurement_unit,
                added_quantity,
                is_resolved,
              }) => {
                const umLabel =
                  customUnits.find(({ value }) => value === measurement_unit)
                    ?.label || measurement_unit;

                return (
                  <tr key={id}>
                    <td className="px-4 py-3.5">{category}</td>
                    <td className="px-4 py-3.5">{specification}</td>
                    <td className="px-4 py-3.5">
                      {`${reported_quantity} ${umLabel}`}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex relative w-fit items-center gap-2 pr-1">
                        <p className="whitespace-nowrap">{`${required_quantity} ${umLabel}`}</p>
                        {!!added_quantity && (
                          <div
                            aria-expanded="false"
                            data-tooltip-id={`added-${id}-tooltip`}
                          >
                            <Tooltip id={`added-${id}-tooltip`} place="top">
                              <div className="max-w-min text-sm">
                                {is_resolved
                                  ? `Se atendió el pedido con ${added_quantity} ${category}`
                                  : `Se atendió parcialmente el pedido con ${added_quantity} ${category}`}
                              </div>
                            </Tooltip>
                            <CountBadge
                              count={added_quantity}
                              variant={is_resolved ? "success" : "warning"}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <TableActions>
                      <ModalTrigger
                        title="Añadir insumo al pedido"
                        modelContent={
                          <ModalComponent
                            orderId={orderId}
                            itemId={id}
                            reported={reported_quantity}
                            added={added_quantity}
                            um={umLabel}
                          />
                        }
                        buttonToggle={<UpdateOrderButton />}
                      />
                    </TableActions>
                  </tr>
                );
              },
            )}
        </Fragment>
      ))}
    </>
  );
}

function UpdateOrderButton({ onClose }: { onClose?: () => void }) {
  return (
    <button
      className={clsx(
        STYLES.buttonTableAction,
        "border-slate-300 bg-white text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700",
      )}
      onClick={onClose}
      aria-label="Editar insumo del pedido"
    >
      <PencilIcon className="w-4" />
    </button>
  );
}
