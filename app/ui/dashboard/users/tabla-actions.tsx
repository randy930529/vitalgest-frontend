import UserDelete from "./button-delete";
import UserEdit from "./botton-edit";

export default function TableActions({ userId }: { userId: string }) {
  // <div>(Component) Botones de editar/eliminar por fila.</div>

  return (
    <>
      <UserEdit userId={userId} />
      <UserDelete userId={userId} />
    </>
  );
}
