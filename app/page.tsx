import { VitalGestLogo } from "@/app/ui/logos";
import { ButtonSignout } from "@/app/ui/button-signout";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col p-6">
      <header className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <VitalGestLogo />
      </header>
      <main className="mt-4 flex grow flex-col gap-4 md:flex-row"></main>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <ButtonSignout />
      </div>
    </div>
  );
}
