import { Suspense } from "react";
import { Metadata } from "next";
import { fetchOrders } from "@/app/lib/data/orders";
import { getPaginationParams } from "@/app/lib/utils";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import OrdersTable from "@/app/ui/dashboard/orders/orders-table";
import { TableSkeleton } from "@/app/ui/components/skeletons";

export const metadata: Metadata = {
  title: "Pedidos a Farmacia",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; display?: string }>;
}) {
  const { page, display } = await searchParams;
  const params = getPaginationParams(Number(page), Number(display));

  return (
    <section className="vital-shell">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          {
            label: "Pedidos",
            href: "/dashboard/orders",
            active: true,
          },
        ]}
      />
      <Suspense
        fallback={
          <TableSkeleton title="Crear Ambulancia" modelContent={<div></div>} />
        }
      >
        <WrapperTable
          fetchData={() => fetchOrders(params)}
          WrappedComponent={OrdersTable}
        />
      </Suspense>
    </section>
  );
}
