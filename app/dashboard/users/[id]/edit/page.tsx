import { fetchUserById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/dashboard/users/breadcrumbs";
import UserEditForm from "@/app/ui/dashboard/users/edit/user-edit-form";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Editar Usuario",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  // <div>(Página) Editar Usuario - [SSR]</div>
  const params = await props.params;
  const id = params.id;
  // Fetch user data from API
  const user = await fetchUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Usuarios", href: "/dashboard/users" },
          {
            label: "Editar Usuario",
            href: `/dashboard/users/${id}/edit`,
            active: true,
          },
        ]}
      />
      <UserEditForm user={user} />
    </main>
  );
}
