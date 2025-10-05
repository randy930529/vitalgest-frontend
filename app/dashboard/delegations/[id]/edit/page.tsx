import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import DelegationEditForm from "@/app/ui/dashboard/delegations/edit/delegation-edit-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { fetchDelegationById, fetchStates } from "@/app/lib/data";

export const metadata: Metadata = {
  title: "Editar Delegación",
};

export default async function DelegationsEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  // <div>(Página) Editar Delegación - [SSR]</div>
  const params = await props.params;
  const id = params.id;

  const [delegation, customStates] = await Promise.all([
    fetchDelegationById(id),
    fetchStates(),
  ]);

  if (!delegation) {
    notFound();
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Delegaciones", href: "/dashboard/delegations" },
          {
            label: "Editar Delegación",
            href: `/dashboard/delegations/${id}/edit`,
            active: true,
          },
        ]}
      />
      <h2 className="flex gap-2 items-center text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
        <PencilSquareIcon className="w-6 h-6" />
        {`Delegación ${delegation?.state?.name}, ${delegation?.municipality?.name}`}
      </h2>
      <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400 text-center md:text-left">
        {delegation?.municipality.name}
      </p>
      <DelegationEditForm
        delegation={delegation}
        customMxStates={customStates}
      />
    </section>
  );
}
