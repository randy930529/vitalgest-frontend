import { Suspense } from "react";
import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { verifySession } from "@/app/lib/dal";
import ProfileForm from "@/app/ui/profile/profile-form";
import { ProfileEditSkeleton } from "@/app/ui/dashboard/skeletons";

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
        <ProfileForm user={session.user} />
      </Suspense>
    </div>
  );
}
