import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/dal";
import { fetchOrders } from "@/app/lib/data/orders";
import { getPaginationParams } from "@/app/lib/utils";
import { ROLE_MANAGER } from "@/app/lib/config/constants";
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
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { page, display } = await searchParams;
  const params = getPaginationParams(Number(page), Number(display));

  const user = session.user;
  const readonly = !ROLE_MANAGER.isAdmin(user.role);

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
          readonly={readonly}
        />
      </Suspense>
    </section>
  );
}
