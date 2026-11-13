import { Suspense } from "react";
import { Metadata } from "next";
import { fetchOrderById } from "@/app/lib/data/orders";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { TableSkeletonBase } from "@/app/ui/components/skeletons";
import { WrapperForm } from "@/app/ui/dashboard/wrappers";
import OrderDetailsTable from "@/app/ui/dashboard/orders/order-details-table";
import { ButtonFallback } from "@/app/ui/components/buttons";
import { getSession } from "@/app/lib/dal";
import { redirect } from "next/navigation";
import { ROLE_MANAGER } from "@/app/lib/config/constants";

export const metadata: Metadata = {
  title: "Detalles del pedido",
};

export default async function OrderDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await props.params;
  const user = session.user;
  const readonly = !ROLE_MANAGER.isAdmin(user.role);
  const fetchOrderByIdWithReadonly = async () =>
    await Promise.all([fetchOrderById(id), readonly]);

  return (
    <main className="vital-shell">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/" },
          { label: "Pedidos", href: "/history/orders" },
          {
            label: "Detalles del pedido",
            href: `/history/orders/${id}/details`,
            active: true,
          },
        ]}
      />
      <Suspense fallback={<OrderDetailsSkeleton />}>
        <WrapperForm
          fetchData={fetchOrderByIdWithReadonly}
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
          navigateTo={`/history/orders`}
        />
      </div>
    </TableSkeletonBase>
  );
}
