"use client";

import { updateUser, UserState } from "@/app/lib/actions";
import { UserType } from "@/app/lib/definitions";
import { Button } from "@/app/ui/button";
import Link from "next/link";
import { useActionState } from "react";

const customRoles = [
  { id: 0, value: "", label: "Seleccione un rol" },
  { id: 1, value: "admin", label: "Administrador" },
  { id: 2, value: "paramedical", label: "Paramédico" },
  { id: 3, value: "vehicle_operator", label: "Operador de Vehículo" },
  { id: 4, value: "head_guard", label: "Jefe de Seguridad" },
  { id: 5, value: "general_admin", label: "Administrador General" },
];

export default function UserEditForm({ user }: { user: UserType | undefined }) {
  // <div>(Component) Formulario de usuario - [CSR]</div>

  const initialState: UserState = { errors: {}, message: null };
  const updateUserWithId = updateUser.bind(null, user?.id || "");
  const [state, formAction] = useActionState(updateUserWithId, initialState);
  console.log(state.errors);

  return (
    <div className="bg-white mt-7 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
      <div className="flex md:flex-row items-center justify-center md:space-y-0 p-4">
        <form action={formAction}>
          {state.message}
          <div className="grid gap-4 mb-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Nombre
              </label>
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={user?.name}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="José Luis"
                required
              />
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Apellidos
              </label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                defaultValue={user?.lastname}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Hernández García"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  defaultValue={user?.email}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="mycorreo@correos.mx"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  defaultValue={user?.password}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Rol del Usuario
                </label>
                <select
                  id="role"
                  name="role"
                  defaultValue={user?.role}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                >
                  {customRoles.map((role) => (
                    <option
                      key={
                        role.value
                          ? `${role.id}-${role.value}`
                          : `${role.id}-select`
                      }
                      value={role.value}
                    >
                      {role.label}
                    </option>
                  ))}
                </select>
                <div id="rol-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.role &&
                    state.errors.role.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="position"
                  className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Posición
                </label>
                <input
                  type="text"
                  name="position"
                  id="position"
                  defaultValue={user?.position}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Empleado"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Estado
                </label>
                <input
                  type="radio"
                  name="state"
                  id="state"
                  value="true"
                  defaultChecked={
                    typeof user?.state === "string"
                      ? user.state === "true"
                      : user?.state
                  }
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Link
              href="/dashboard/users"
              className="text-white inline-flex items-center bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Cancelar
            </Link>
            <Button
              type="submit"
              className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
