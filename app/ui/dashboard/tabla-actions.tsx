export default function TableActions({
  children,
}: {
  children?: React.ReactNode;
}) {
  // <div>(Component) Botones de editar/eliminar por fila.</div>

  return (
    <td className="px-4 py-3 flex items-center justify-end">{children}</td>
  );
}
