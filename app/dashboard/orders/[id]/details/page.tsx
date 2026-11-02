import { Suspense } from "react";
import { Metadata } from "next";
import { fetchOrderById } from "@/app/lib/data/orders";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { TableSkeletonBase } from "@/app/ui/components/skeletons";
import { WrapperForm } from "@/app/ui/dashboard/wrappers";
import OrderDetailsTable from "@/app/ui/dashboard/orders/order-details-table";
import { ButtonFallback } from "@/app/ui/components/buttons";

export const metadata: Metadata = {
  title: "Detalles del pedido",
};

export default async function OrderDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  return (
    <main className="vital-shell">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Pedidos", href: "/dashboard/orders" },
          {
            label: "Detalles del pedido",
            href: `/dashboard/orders/${id}/details`,
            active: true,
          },
        ]}
      />
      <Suspense fallback={<OrderDetailsSkeleton />}>
        <WrapperForm
          fetchData={() => fetchOrderById(id)}
          WrappedComponent={OrderDetailsTable}
        />
      </Suspense>
    </main>
  );
}

function OrderDetailsSkeleton() {
  return (
    <TableSkeletonBase>
      <div className="flex flex-col gap-3 p-5 border-b border-slate-200/80 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Detalles del pedido
          </h2>
          <div className="max-w-64 h-4 mt-3 bg-gray-300 rounded" />
        </div>
        <ButtonFallback
          title="Volver a pedidos"
          navigateTo={`/dashboard/orders`}
        />
      </div>
    </TableSkeletonBase>
  );
}
