import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import DelegationEditForm from "@/app/ui/dashboard/delegations/edit/delegation-edit-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import {
  fetchDelegationById,
  fetchMunicipalityByStateId,
  fetchStates,
} from "@/app/lib/data";

export const metadata: Metadata = {
  title: "Editar Delegación",
};

export default async function DelegationsEditPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ state: string; municipality: string }>;
}) {
  // <div>(Página) Editar Delegación - [SSR]</div>
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  const id = params.id;
  const delegation = await fetchDelegationById(id);

  if (!delegation) {
    notFound();
  }

  if (!searchParams.state || !searchParams.municipality) {
    redirect(
      `/dashboard/delegations/${id}/edit?state=${delegation.state.id}&municipality=${delegation.municipality.id}`
    );
  }

  const municipalities = await fetchMunicipalityByStateId(
    delegation?.state.id || -1
  );
  const customStates = await fetchStates();

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
        {delegation?.name}
      </h2>
      <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400 text-center md:text-left">
        {delegation?.municipality.name}
      </p>
      <DelegationEditForm
        delegation={delegation}
        customStates={customStates}
        customMunicipalities={municipalities}
      />
    </section>
  );
}
