import { Suspense } from "react";
import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { verifySession } from "@/app/lib/dal";
import ProfileForm from "@/app/ui/profile/profile-form";
import { ProfileEditSkeleton } from "@/app/ui/dashboard/skeletons";

export const metadata: Metadata = {
  title: "Mi Perfil",
};

async function ProfileFormLoader() {
  const session = await verifySession();

  return <ProfileForm user={session.user} />;
}

export default async function EditProfilePage() {
  return (
    <main className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/" },
          { label: "Mi perfil", href: "/profile/edit", active: true },
        ]}
      />

      <Suspense fallback={<ProfileEditSkeleton />}>
        <ProfileFormLoader />
      </Suspense>
    </main>
  );
}
