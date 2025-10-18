import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { fetchAmbulanceById } from "@/app/lib/data";
import AmbulanceEditForm from "@/app/ui/dashboard/ambulances/edit/ambulance-edit-form";

export const metadata: Metadata = {
  title: "Editar Ambulancia",
};

export default async function EditAmbulancePage(props: {
  params: Promise<{ id: string }>;
}) {
  // <div>(Página) Editar Ambulancia - [SSR]</div>
  const params = await props.params;
  const id = params.id;
  const ambulance = await fetchAmbulanceById(id);

  if (!ambulance) {
    notFound();
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Ambulancias", href: "/dashboard/ambulances" },
          {
            label: "Editar Ambulancia",
            href: `/dashboard/ambulances/${id}/edit`,
            active: true,
          },
        ]}
      />
      <h2 className="flex gap-2 items-center text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
        <PencilSquareIcon className="w-6 h-6" />
        {ambulance?.numero}
      </h2>
      <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400 text-center md:text-left">
        {ambulance?.marca} - {ambulance?.modelo}
      </p>
      <AmbulanceEditForm ambulance={ambulance} />
    </section>
  );
}
