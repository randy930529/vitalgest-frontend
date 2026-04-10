import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function TableActionEdit({ editLink }: { editLink: string }) {
  return (
    <Link
      href={editLink}
      className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
      aria-label="Editar registro"
    >
      <PencilIcon className="w-4" />
    </Link>
  );
}
