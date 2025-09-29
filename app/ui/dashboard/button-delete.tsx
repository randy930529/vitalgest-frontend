import { TrashIcon } from "@heroicons/react/24/outline";

export default function TableActionDelete({
  id,
  actionDelete,
}: {
  id: string;
  actionDelete: (id: string) => Promise<void>;
}) {
  const handleDelete = actionDelete.bind(null, id);

  return (
    <form action={handleDelete}>
      <button
        type="submit"
        id={`user-${id}-delete`}
        className="rounded-md border p-2 hover:bg-gray-100"
      >
        <span className="sr-only">Eliminar</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
