import { FaceFrownIcon } from "@heroicons/react/24/outline";
import { Notfound404 } from "@/app/ui/page-error";

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <Notfound404
        error={404}
        message="No se encontró la ambulancia solicitada."
        goBack="/dashboard/ambulances"
      />
    </main>
  );
}
