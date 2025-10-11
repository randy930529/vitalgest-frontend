import { fetchUsers } from "@/app/lib/data";
import { deleteUser } from "@/app/lib/actions/user";
import Filters from "@/app/ui/dashboard/table-filters";
import TableActions from "@/app/ui/dashboard/tabla-actions";
import TablePagination from "@/app/ui/dashboard/pagination";
import TableActionEdit from "@/app/ui/dashboard/botton-edit";
import TableActionDelete from "@/app/ui/dashboard/button-delete";
import ModalTrigger from "@/app/ui/button-modal";
import UserForm from "@/app/ui/dashboard/users/create/user-form";

const customRoles = [
  { id: 0, value: "", label: "Seleccione un rol" },
  { id: 1, value: "admin", label: "Administrador" },
  { id: 2, value: "paramedical", label: "Paramédico" },
  { id: 3, value: "vehicle_operator", label: "Operador de Vehículo" },
  { id: 4, value: "head_guard", label: "Jefe de Seguridad" },
  { id: 5, value: "general_admin", label: "Administrador General" },
];

const customHeaders = [
  { id: 0, label: "Nombre" },
  { id: 1, label: "Apellidos" },
  { id: 2, label: "Correo" },
  { id: 3, label: "Rol" },
  { id: 4, label: "Estado" },
];

export default async function UserTable() {
  const users = await fetchUsers();

  {
    /* <div>(Component) Tabla interactiva de usuarios - [CSR]</div> */
  }

  return (
    <div className="bg-white mt-7 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
      <Filters>
        <ModalTrigger title="Crear Usuario" modelContent={<UserForm />} />
      </Filters>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">
                <div className="flex items-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-all" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              {customHeaders.map((header) => (
                <th key={header.id} scope="col" className="px-4 py-3">
                  {header.label}
                </th>
              ))}
              <th
                scope="col"
                className="px-4 py-3 flex items-center justify-end"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-b dark:border-gray-700">
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-${user.id}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`checkbox-table-${user.id}`}
                      className="sr-only"
                    >
                      checkbox
                    </label>
                  </div>
                </td>
                <th
                  scope="row"
                  className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {user.name}
                </th>
                <td className="px-4 py-3">{user.lastname}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  {customRoles.find((rol) => user.role === rol.value)?.label}
                </td>
                <td className="px-4 py-3">
                  <UserActive active={user.state} />
                </td>
                <TableActions>
                  <TableActionEdit
                    editLink={`/dashboard/users/${user.id}/edit`}
                  />
                  <TableActionDelete id={user.id} actionDelete={deleteUser} />
                </TableActions>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination totalItems={users.length} />
    </div>
  );
}

function UserActive(
  { active }: { active: boolean | string | undefined | null } = { active: true }
) {
  let userState = false;
  if (typeof active === "string") {
    userState = active === "true";
  } else {
    userState = !!active;
  }
  return (
    <div className="flex items-center">
      <div
        className={`h-2.5 w-2.5 rounded-full ${
          userState ? "bg-green-500" : "bg-red-500"
        } me-2`}
      ></div>{" "}
      {userState ? "Activo" : "Inactivo"}
    </div>
  );
}
