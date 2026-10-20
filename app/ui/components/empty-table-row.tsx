export default function EmptyTableRow({
  isListEmpty,
  colSpan,
  message = "No hay elementos para mostrar.",
}: {
  isListEmpty: boolean;
  colSpan: number;
  message?: string;
}) {
  if (!isListEmpty) return null;

  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-4 text-slate-500">
        {message}
      </td>
    </tr>
  );
}
