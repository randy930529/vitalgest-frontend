"use client";

import clsx from "clsx";
import { Tooltip } from "react-tooltip";
import {
  DelegationType,
  PaginatedResult,
  UserType,
} from "@/app/lib/definitions";
import { deleteUser } from "@/app/lib/actions/user";
import { STYLES, ROLE_MANAGER } from "@/app/lib/config/constants";
import { useTableSelection } from "@/app/lib/hooks/useTableSelection";
import TableActionDeleteAllSelected from "@/app/ui/dashboard/button-delete-all";
import Filters from "@/app/ui/dashboard/table-filters";
import TableActions from "@/app/ui/dashboard/tabla-actions";
import TablePagination from "@/app/ui/components/pagination";
import TableActionEdit from "@/app/ui/dashboard/botton-edit";
import TableActionDelete from "@/app/ui/dashboard/button-delete";
import ModalTrigger from "@/app/ui/button-modal";
import { modalComponents } from "@/app/lib/config/modalConfig";
import { runBulkDeleteWithFeedback } from "@/app/lib/bulk-delete-feedback";
import EmptyTableRow from "@/app/ui/components/empty-table-row";
import TableCheckbox from "@/app/ui/dashboard/table-checkbox";

const ModalComponent = modalComponents.userForm;

const customHeaders = [
  { id: 0, label: "Nombre" },
  { id: 1, label: "Apellidos" },
  { id: 2, label: "Correo" },
  { id: 3, label: "Rol" },
  { id: 4, label: "Estado" },
];

export default function UserTable({
  data,
}: {
  data: [PaginatedResult<UserType>, DelegationType[]];
}) {
  // (Component) Tabla interactiva de usuarios - [CSR]

  const [{ data: users, totalRecords }, delegations] = data;
  const {
    selectedIds,
    setSelectedIds,
    allSelected,
    handleCheckboxChange,
    handleSelectAllChange,
  } = useTableSelection(users);

  return (
    <main className={clsx(STYLES.mainTable)}>
      <Filters>
        {selectedIds.length > 0 && (
          <TableActionDeleteAllSelected
            selectedIds={selectedIds}
            actionDelete={async (ids: string[]) => {
              return runBulkDeleteWithFeedback({
                ids,
                deleteAction: deleteUser,
                setFailedSelection: setSelectedIds,
                pluralLabel: "usuario(s)",
                singularLabel: "el usuario",
              });
            }}
          />
        )}
        <ModalTrigger
          title="Crear Usuario"
          modelContent={<ModalComponent delegations={delegations} />}
        />
      </Filters>
      <p className="px-4 py-2 text-xs text-slate-500" aria-live="polite">
        {selectedIds.length > 0
          ? `${selectedIds.length} usuario(s) seleccionado(s)`
          : "Selecciona usuarios para acciones masivas"}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <caption className="sr-only">
            Tabla de usuarios con selección, estado y acciones de edición o
            eliminación.
          </caption>
          <thead className="bg-slate-100/80 text-xs uppercase tracking-[0.08em] text-slate-600">
            <tr>
              <th scope="col" className="px-4 py-3">
                <div className="flex items-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    className="h-4 w-4 rounded-sm border-slate-300 bg-white text-rose-600 focus:ring-2 focus:ring-rose-300"
                    data-tooltip-id="checkbox-all-tooltip"
                    checked={allSelected}
                    aria-label="Seleccionar todos los usuarios"
                    onChange={(event) => {
                      handleSelectAllChange(event.target.checked);
                    }}
                  />
                  <Tooltip
                    id="checkbox-all-tooltip"
                    content="Seleccionar Todos"
                    className="font-normal capitalize"
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
              <th scope="col" className="px-4 py-3 text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            <EmptyTableRow
              isListEmpty={!users.length}
              colSpan={customHeaders.length + 2}
              message="No hay usuarios en el sistema."
            />
            {users?.map((user) => (
              <tr
                key={user.id}
                className="border-b border-slate-200 transition-colors hover:bg-slate-50/70"
              >
                <td className="w-4 p-4">
                  <TableCheckbox
                    id={`checkbox-table-${user.id}`}
                    checked={selectedIds.includes(user.id)}
                    ariaLabel={`Seleccionar usuario ${user.name} ${user.lastname}`}
                    onChange={(checked) =>
                      handleCheckboxChange(user.id, checked)
                    }
                  />
                </td>
                <th
                  scope="row"
                  className="whitespace-nowrap px-4 py-3.5 font-medium text-slate-900"
                >
                  {user.name}
                </th>
                <td className="px-4 py-3.5">{user.lastname}</td>
                <td className="px-4 py-3.5">{user.email}</td>
                <td className="px-4 py-3.5">
                  {ROLE_MANAGER.getLabel(user.role)}
                </td>
                <td className="px-4 py-3.5">
                  <UserActive active={user.status} />
                </td>
                <TableActions>
                  <TableActionEdit
                    editLink={`/dashboard/users/${user.id}/edit`}
                  />
                  <TableActionDelete
                    id={user.id}
                    title="Eliminar Usuario"
                    actionDelete={deleteUser}
                    question={`¿Está seguro que desea eliminar el usuario ${user.name} ${user.lastname}?`}
                    details="Esta accion desactivara permanentemente la cuenta del usuario. El usuario no podra acceder al sistema, pero su informacion se mantendra en la base de datos para fines históricos."
                  />
                </TableActions>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination totalItems={totalRecords} />
    </main>
  );
}

function UserActive(
  { active }: { active: boolean | string | undefined | null } = {
    active: true,
  },
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
