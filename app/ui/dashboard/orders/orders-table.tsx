"use client";

import clsx from "clsx";
import { Tooltip } from "react-tooltip";
import { EyeIcon } from "@heroicons/react/24/outline";
import {
  OrderType,
  PaginatedResult,
  ToneVariants,
} from "@/app/lib/definitions";
import { STYLES } from "@/app/lib/config/constants";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import { deleteOrder } from "@/app/lib/actions/order";
import { useTableSelection } from "@/app/lib/hooks/useTableSelection";
import Filters from "@/app/ui/dashboard/table-filters";
import TablePagination from "@/app/ui/components/pagination";
import TableActions from "@/app/ui/dashboard/tabla-actions";
import TableActionEdit from "@/app/ui/dashboard/botton-edit";
import EmptyTableRow from "@/app/ui/components/empty-table-row";
import TableCheckbox from "@/app/ui/dashboard/table-checkbox";
import TableActionDelete from "@/app/ui/dashboard/button-delete";
import { Badge } from "@/app/ui/components/badges";

const customHeaders = [
  { id: 0, label: "Fecha" },
  { id: 1, label: "Ambulancia" },
  { id: 2, label: "Estado" },
];

export default function OrdersTable({
  data,
}: {
  data: PaginatedResult<OrderType>;
}) {
  // (Component) Tabla interactiva de pedidos - [CSR]

  const { data: orders, totalRecords } = data;
  const {
    selectedIds,
    setSelectedIds,
    allSelected,
    handleCheckboxChange,
    handleSelectAllChange,
  } = useTableSelection(orders);

  return (
    <main className={clsx(STYLES.mainTable)}>
      <Filters />
      <p className="px-4 py-2 text-xs text-slate-500" aria-live="polite">
        {selectedIds.length > 0
          ? `${selectedIds.length} pedido(s) seleccionado(s)`
          : "Selecciona pedidos para acciones masivas"}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <caption className="sr-only">
            Tabla de pedidos realizados a farmacia.
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
                    aria-label="Seleccionar todos los pedidos"
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
            <EmptyTableRow
              isListEmpty={!orders.length}
              colSpan={customHeaders.length + 2}
              message="No hay pedidos para mostrar."
            />
            {orders?.map((order) => (
              <tr
                key={order.id}
                className="border-b border-slate-200 transition-colors hover:bg-slate-50/70"
              >
                <td className="w-4 p-4">
                  <TableCheckbox
                    id={`checkbox-table-${order.id}`}
                    checked={selectedIds.includes(order.id)}
                    ariaLabel={`Seleccionar pedido ${order.id}`}
                    onChange={(checked) =>
                      handleCheckboxChange(order.id, checked)
                    }
                  />
                </td>
                <td className="px-4 py-3.5">
                  {formatDateToDDMMYYYY(order.createdAt)}
                </td>
                <td className="px-4 py-3.5">{order.ambulance.number}</td>
                <td className="px-4 py-3.5">
                  <OrderStatusShow status={order.status} />
                </td>
                <TableActions>
                  <TableActionEdit
                    editLink={`/dashboard/orders/${order.id}/details`}
                    title="Editar Pedido"
                    icon={EyeIcon}
                    customStyle="border-sky-300 bg-sky-50 text-sky-700 transition hover:bg-sky-100"
                  />
                  <TableActionDelete
                    id={order.id}
                    title="Eliminar Pedido"
                    question="¿Está seguro que desea eliminar el pedido?"
                    actionDelete={deleteOrder}
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

export function OrderStatusShow({ status }: { status: OrderType["status"] }) {
  const variantMap: Record<
    OrderType["status"],
    { title: string; variant: ToneVariants }
  > = {
    pending: { title: "Pendiente", variant: "warning" },
    attended: { title: "Atendido", variant: "success" },
    cancelled: { title: "Cancelado", variant: "neutral" },
  };

  const { title, variant } = variantMap[status];
  return <Badge title={title} variant={variant} />;
}
