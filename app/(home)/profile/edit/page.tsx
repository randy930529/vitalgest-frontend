import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { verifySession } from "@/app/lib/dal";
import { UserType } from "@/app/lib/definitions";
import { fetchDelegationById } from "@/app/lib/data/delegations";
import { fetchUserById } from "@/app/lib/data/users";
import { createSignatureURL } from "@/app/lib/utils";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import ProfileForm from "@/app/ui/profile/profile-form";
import { ProfileEditSkeleton } from "@/app/ui/components/skeletons";

export const metadata: Metadata = {
  title: "Mi Perfil",
};

export default async function EditProfilePage() {
  const session = await verifySession();
  const isAdmin =
    session.user.role === "admin" || session.user.role === "general_admin";
  const homeHref = isAdmin ? "/dashboard" : "/";

  return (
    <div className="space-y-4 p-1 sm:p-0">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: homeHref },
          { label: "Mi perfil", href: "/profile/edit", active: true },
        ]}
      />

      <Suspense fallback={<ProfileEditSkeleton />}>
        <LoadUserInfo id={session.user.id} WrappedComponent={ProfileForm} />
      </Suspense>
    </div>
  );
}

async function LoadUserInfo({
  id,
  WrappedComponent,
}: {
  id: string;
  WrappedComponent: React.ComponentType<{
    user: UserType;
  }>;
}) {
  const user = await fetchUserById(id);
  if (!user) notFound();

  if (!user.delegation.name) {
    const delegation = await fetchDelegationById(user.delegation.id);
    user.delegation.name = delegation?.name || "N/A";
  }

  if (user.signature) {
    user.signature = createSignatureURL(user.signature);
  }

  return <WrappedComponent user={user} />;
}
