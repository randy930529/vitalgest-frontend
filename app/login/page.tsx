import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/dal";
import { VitalGestLogo } from "@/app/ui/logos";
import LoginForm from "@/app/ui/login-form";
import { openSans } from "@/app/ui/fonts";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    const userRole = session.user.role;
    const isAdmin = userRole === "admin" || userRole === "general_admin";
    if (isAdmin) {
      redirect("/dashboard");
    } else {
      redirect("/");
    }
  }

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full justify-center rounded-lg md:h-36">
          <VitalGestLogo />
        </div>
        <h1 className={`${openSans.className} text-2xl text-center`}>
          VitalGest
        </h1>
        <p
          className={`${openSans.className} text-sm text-gray-500 text-center`}
        >
          Sistema Administrativo
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
