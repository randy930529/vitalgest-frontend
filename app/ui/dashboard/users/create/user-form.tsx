"use client";

import { createUser, UserState } from "@/app/lib/actions";
import { Button } from "@/app/ui/button";
import { InlineErrors } from "@/app/ui/custom-errors";
import { useActionState } from "react";

const customRoles = [
  { id: 0, value: "", label: "Seleccione un rol" },
  { id: 1, value: "admin", label: "Administrador" },
  { id: 2, value: "paramedical", label: "Paramédico" },
  { id: 3, value: "vehicle_operator", label: "Operador de Vehículo" },
  { id: 4, value: "head_guard", label: "Jefe de Seguridad" },
  { id: 5, value: "general_admin", label: "Administrador General" },
];

export default function UserForm({ onClose }: { onClose?: () => void }) {
  // <div>(Component) Formulario de usuario - [CSR]</div>

  const initialState: UserState = { errors: {}, message: null };
  const [state, formAction] = useActionState(createUser, initialState);

  return (
    <form action={formAction}>
      {state.errors?.success && (
        <InlineErrors
          key={`${"success"}-error`}
          errorId={`${"success"}-error`}
          errors={state.errors?.success}
        />
      )}
      <div className="grid gap-4 mb-4 sm:grid-cols-2">
        <FormInput
          key="name"
          name="name"
          placeholder="José Luis"
          errors={state.errors?.name}
        />

        <FormInput
          key="lastname"
          name="lastname"
          placeholder="Hernández García"
          errors={state.errors?.lastname}
        />

        <div className="sm:col-span-2">
          <FormInput
            key="email"
            name="email"
            placeholder="mycorreo@correos.mx"
            errors={state.errors?.email}
          />

          <FormInput
            key="password"
            name="password"
            placeholder="••••••••"
            errors={state.errors?.password}
          />

          <FormInput
            key="position"
            name="position"
            placeholder="Empleado"
            errors={state.errors?.position}
          />

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
            {state.errors?.role && (
              <InlineErrors
                key="rol-error"
                errorId="rol-error"
                errors={state.errors?.role}
              />
            )}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end gap-4">
        <Button
          type="reset"
          onClick={onClose}
          className="text-white inline-flex items-center bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Guardar
        </Button>
      </div>
    </form>
  );
}

function FormInput({
  name,
  placeholder,
  errors,
}: {
  name: string;
  placeholder: string;
  errors?: string[];
}) {
  const customFormInputType: { [key: string]: string[] } = {
    name: ["text", "Nombre"],
    lastname: ["text", "Apellidos"],
    email: ["email", "Correo Electrónico"],
    password: ["password", "Contraseña"],
    position: ["text", "Posición"],
  };
  const [inputType, inputTitle] = customFormInputType[name];

  return (
    <div>
      <label
        htmlFor={name}
        className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {inputTitle}
      </label>
      <input
        type={inputType}
        name={name}
        id={name}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        placeholder={placeholder}
        required
      />
      {errors && (
        <InlineErrors
          key={`${name}-error`}
          errorId={`${name}-error`}
          errors={errors}
        />
      )}
    </div>
  );
}
