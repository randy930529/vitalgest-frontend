export default function UserTable() {
  return (
    <>
      <div>(Component) Tabla interactiva de usuarios - [CSR]</div>
      <TableActions />
      <TablePagination />
      <Filters />
    </>
  );
}

export function TableActions() {
  return <div>(Component) Botones de editar/eliminar por fila.</div>;
}

export function TablePagination() {
  return <div>(Component) Controles de paginación de la tabla.</div>;
}

export function Filters() {
  return <div>(Component) Barra de búsqueda y filtros - [CSR]</div>;
}
