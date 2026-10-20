import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchOrderById } from "@/app/lib/data/orders";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { FormSkeleton } from "@/app/ui/components/skeletons";
import { WrapperForm } from "@/app/ui/dashboard/wrappers";
import OrderDetailsTable from "@/app/ui/dashboard/orders/order-details-table";

export const metadata: Metadata = {
  title: "Detalles del pedido",
};

export default async function OrderDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const order = await fetchOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <main className="vital-shell">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Pedidos", href: "/dashboard/orders" },
          {
            label: "Detalles del pedido",
            href: `/dashboard/orders/${id}`,
            active: true,
          },
        ]}
      />
      <Suspense fallback={<FormSkeleton goBackUrl="/dashboard/orders" />}>
        <WrapperForm
          fetchData={() => Promise.resolve(order)}
          WrappedComponent={OrderDetailsTable}
        />
      </Suspense>
    </main>
  );
}
