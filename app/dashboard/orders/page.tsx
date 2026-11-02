import { Suspense } from "react";
import { Metadata } from "next";
import { fetchOrders } from "@/app/lib/data/orders";
import { getPaginationParams } from "@/app/lib/utils";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import OrdersTable from "@/app/ui/dashboard/orders/orders-table";
import { TableSkeletonBase } from "@/app/ui/components/skeletons";
import Filters from "@/app/ui/dashboard/table-filters";

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
          <TableSkeletonBase>
            <Filters />
          </TableSkeletonBase>
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
