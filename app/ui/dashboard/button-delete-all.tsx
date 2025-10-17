import TableActionDelete from "@/app/ui/dashboard/button-delete";

export default function TableActionDeleteAllSelected({
  selectedIds,
  actionDelete,
}: {
  selectedIds: string[];
  actionDelete: (id: string[]) => Promise<void>;
}) {
  const handleDelete = actionDelete.bind(null, selectedIds);

  return (
    <div className="relative my-3 text-sm text-gray-500 dark:text-gray-300">
      <TableActionDelete id={"ambulanceIds"} actionDelete={handleDelete} />
      <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-primary-700 text-xs font-bold text-white">
        {selectedIds.length}
      </div>
    </div>
  );
}
