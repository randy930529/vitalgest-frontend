"use client";

import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { DelegationType, UserType } from "@/app/lib/definitions";
import { deleteUser } from "@/app/lib/actions/user";
import TableActionDeleteAllSelected from "@/app/ui/dashboard/button-delete-all";
import Filters from "@/app/ui/dashboard/table-filters";
import TableActions from "@/app/ui/dashboard/tabla-actions";
import TablePagination from "@/app/ui/dashboard/pagination";
import TableActionEdit from "@/app/ui/dashboard/botton-edit";
import TableActionDelete from "@/app/ui/dashboard/button-delete";
import ModalTrigger from "@/app/ui/button-modal";
import { modalComponents } from "@/app/lib/config/modalConfig";
import { ROLE_MANAGER } from "@/app/lib/config/constants";
import { runBulkDeleteWithFeedback } from "@/app/lib/bulk-delete-feedback";

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
  data: [UserType[], DelegationType[]];
}) {
  // (Component) Tabla interactiva de usuarios - [CSR]

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [users, delegations] = data;
  const allSelected = users.length > 0 && selectedIds.length === users.length;

  function handleCheckboxChange(checkedId: string, checked: boolean) {
    if (checked) {
      setSelectedIds([...selectedIds, checkedId]);
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== checkedId));
    }
  }

  function handleSelectAllChange(checked: boolean) {
    const ambulanceArray = users.map((r) => r.id);
    setSelectedIds(checked ? ambulanceArray : []);
  }

  return (
    <main className="relative mt-7 overflow-hidden rounded-[26px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm">
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
            {users?.map((user) => (
              <tr
                key={user.id}
                className="border-b border-slate-200 transition-colors hover:bg-slate-50/70"
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-${user.id}`}
                      type="checkbox"
                      className="h-4 w-4 rounded-sm border-slate-300 bg-white text-rose-600 focus:ring-2 focus:ring-rose-300"
                      value={user.id}
                      checked={selectedIds.includes(user.id)}
                      aria-label={`Seleccionar usuario ${user.name} ${user.lastname}`}
                      onChange={(event) => {
                        handleCheckboxChange(user.id, event.target.checked);
                      }}
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
      <TablePagination totalItems={users.length} />
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
