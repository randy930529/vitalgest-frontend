import { FaceFrownIcon } from "@heroicons/react/24/outline";
import { Notfound404 } from "@/app/ui/page-error";

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2 bg-white mt-7 p-10 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <Notfound404
        error={404}
        message="No se encontró la delegación solicitada."
        goBack="/dashboard/delegations"
      />
    </main>
  );
}
