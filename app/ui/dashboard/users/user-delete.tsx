"use client";

import { deleteUser } from "@/app/lib/actions";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function UserDelete({ userId }: { userId: string }) {
  const handleDelete = deleteUser.bind(null, userId);

  return (
    <form action={handleDelete}>
      <button
        type="submit"
        id={`user-${userId}-delete`}
        className="rounded-md border p-2 hover:bg-gray-100"
      >
        <span className="sr-only">Eliminar</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
