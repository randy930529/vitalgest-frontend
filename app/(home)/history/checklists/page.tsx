import { Suspense } from "react";
import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { TableSkeleton } from "@/app/ui/components/skeletons";
import { getPaginationParams } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Historial de Checklists",
};

export default async function ChecklistHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; display?: string }>;
}) {
  // (Página) Listado de checklists - [SSR]

  const { page, display } = await searchParams;
  const params = getPaginationParams(Number(page), Number(display));

  const fetchChecklistsHistory = async () => await Promise.all([]);

  return (
    <section className="vital-shell">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/" },
          { label: "Checklists", href: "/history/checklists", active: true },
        ]}
      />
      <Suspense
        fallback={<TableSkeleton title="" modelContent={<div></div>} />}
      >
        {/* <WrapperTable
          fetchData={fetchChecklistsHistory}
          WrappedComponent={ChecklistHistoryTable}
        /> */}
      </Suspense>
    </section>
  );
}
