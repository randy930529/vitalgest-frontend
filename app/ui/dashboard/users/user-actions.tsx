import UserDelete from "./user-delete";
import UserEdit from "./user-edit";

export default function TableActions({ userId }: { userId: string }) {
  // <div>(Component) Botones de editar/eliminar por fila.</div>

  return (
    <>
      <UserEdit userId={userId} />
      <UserDelete userId={userId} />
    </>
  );
}
