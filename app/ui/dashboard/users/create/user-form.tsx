"use client";

import { createUser, UserState } from "@/app/lib/actions";
import { Button } from "@/app/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useActionState } from "react";

const customRoles = [
  { id: 0, value: "", label: "Seleccione un rol" },
  { id: 1, value: "admin", label: "Administrador" },
  { id: 2, value: "paramedical", label: "Paramédico" },
  { id: 3, value: "vehicle_operator", label: "Operador de Vehículo" },
  { id: 4, value: "head_guard", label: "Jefe de Seguridad" },
  { id: 5, value: "general_admin", label: "Administrador General" },
];

export default function UserForm() {
  // <div>(Component) Formulario de usuario - [CSR]</div>

  const initialState: UserState = { errors: {}, message: null };
  const [state, formAction] = useActionState(createUser, initialState);

  return (
    <form action={formAction}>
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirmar Contraseña
            </label>
            <input
              type="password"
              name="confirm_password"
              id="confirm_password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
            />
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Empleado"
              required
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
            >
              {customRoles.map((rol) => (
                <option
                  key={
                    rol.value ? `${rol.id}-${rol.value}` : `${rol.id}-select`
                  }
                  value={rol.value}
                >
                  {rol.label}
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
        </div>
      </div>
      <div className="w-full flex justify-end">
        <Button
          type="submit"
          className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          {/* <PlusIcon className="w-5 h-5 me-2" /> */}
          Guardar
        </Button>
      </div>
    </form>
  );
}
