import { fetchUserById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import UserEditForm from "@/app/ui/dashboard/users/edit/user-edit-form";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Editar Usuario",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  // <div>(Página) Editar Usuario - [SSR]</div>
  const params = await props.params;
  const id = params.id;
  const user = await fetchUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
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
      <h2 className="flex gap-2 items-center text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
        <PencilSquareIcon className="w-6 h-6" />
        {`${user?.name} ${user?.lastname}`}
      </h2>
      <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400 text-center md:text-left">
        {user?.email}
      </p>
      <UserEditForm user={user} />
    </section>
  );
}
