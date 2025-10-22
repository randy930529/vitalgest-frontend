import { Suspense } from "react";
import { Metadata } from "next";
import { fetchDelegations, fetchUserById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { FormSkeleton } from "@/app/ui/dashboard/skeletons";
import UserEditForm from "@/app/ui/dashboard/users/edit/user-edit-form";
import { WrapperForm } from "@/app/ui/dashboard/wrappers";

//TODO: Agregar los metadatos a cada pagina
export const metadata: Metadata = {
  title: "Editar Usuario",
};

export default async function EditUserPage(props: {
  params: Promise<{ id: string }>;
}) {
  // <div>(Página) Editar Usuario - [SSR]</div>

  const params = await props.params;
  const id = params.id;
  const fetchUserByIdAndDelegations = async () =>
    await Promise.all([fetchUserById(id), fetchDelegations()]);

  return (
    <main className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Usuarios", href: "/dashboard/users" },
          {
            label: "Editar Usuario",
            href: `/dashboard/users/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Suspense fallback={<FormSkeleton goBackUrl="/dashboard/users" />}>
        <WrapperForm
          fetchData={fetchUserByIdAndDelegations}
          WrappedComponent={UserEditForm}
        />
      </Suspense>
    </main>
  );
}
