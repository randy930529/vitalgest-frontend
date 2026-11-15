import { XMarkIcon } from "@heroicons/react/24/outline";
import { deleteShift } from "@/app/lib/actions/shift";

export default function ShiftDeleteButton({
  id,
  onRemove,
}: {
  id: string;
  onRemove: (message: string) => void;
}) {
  async function handleShiftDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    const { message, errors } = await deleteShift(id);
    onRemove(message || errors?.success?.[0] || "Error al eliminar el turno");
  }

  return (
    <button
      type="button"
      onClick={handleShiftDelete}
      className="absolute right-2 top-2 text-slate-400 transition-colors hover:text-red-500"
      title="Eliminar turno"
    >
      <XMarkIcon className="h-5 w-5" />
    </button>
  );
}
