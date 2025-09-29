import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function TableActionEdit({ editLink }: { editLink: string }) {
  return (
    <Link
      href={editLink}
      className="rounded-md border bg-red-200 p-2 mr-2 hover:bg-red-300"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
