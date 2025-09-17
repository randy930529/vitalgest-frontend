import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function UserEdit({ userId }: { userId: string }) {
  return (
    <Link
      href={`/dashboard/users/${userId}/edit`}
      className="rounded-md border bg-red-200 p-2 mr-2 hover:bg-red-300"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
