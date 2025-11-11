"use client";

import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";
import { DelegationType } from "@/app/lib/definitions";
import { createUser, UserState } from "@/app/lib/actions/user";
import { InlineErrors } from "@/app/ui/custom-errors";
import { Button } from "@/app/ui/button";
import { FormInput } from "@/app/ui/dashboard/form-fields";
import { customRoles } from "@/app/ui/dashboard/users/user-table";
import DelegationsSelector from "@/app/ui/dashboard/delegations/delegations-selector";

const customFormInput = {
  name: { type: "text", title: "Nombre", required: true },
  lastname: { type: "text", title: "Apellidos", required: true },
  email: { type: "email", title: "Correo Electrónico", required: true },
  password: { type: "password", title: "Contraseña", required: true },
  position: { type: "text", title: "Cargo Laboral", required: true },
};

export default function UserForm({
  onClose,
  delegations,
}: {
  onClose?: () => void;
  delegations?: DelegationType[];
}) {
  // <div>(Component) Formulario de usuario - [CSR]</div>

  const initialState: UserState = { errors: {}, message: null };
  const [state, formAction] = useActionState(createUser, initialState);

  useEffect(() => {
    state.message && toast.success(state.message);
    state.message && onClose && onClose();
  }, [state.message]);

  useEffect(() => {
    state.errors?.success &&
      state.errors?.success.map((error: string) => toast.error(error));
  }, [state.errors?.success]);

  return (
    <form action={formAction}>
      <div className="grid gap-4 mb-4 sm:grid-cols-2">
        {Object.keys(customFormInput)
          .filter((key) => key === "name" || key === "lastname")
          .map((name) => (
            <FormInput
              key={name}
              name={name}
              errors={state.errors?.[name as "name" | "lastname"]}
              customFormInput={customFormInput}
            />
          ))}

        <div className="sm:col-span-2">
          {Object.keys(customFormInput)
            .filter(
              (key) =>
                key === "email" || key === "password" || key === "position"
            )
            .map((name) => (
              <FormInput
                key={name}
                name={name}
                errors={
                  state.errors?.[name as "email" | "password" | "position"]
                }
                customFormInput={customFormInput}
              />
            ))}

          {delegations && (
            <DelegationsSelector
              delegations={delegations}
              errors={state.errors?.delegation}
            />
          )}
          <UserRolesSelect errors={state.errors?.role} required />
        </div>
      </div>
      <div className="w-full flex justify-end gap-4">
        <Button
          type="reset"
          onMouseDown={onClose}
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

export function UserRolesSelect({
  errors,
  required,
  defaultValue,
}: {
  errors?: string[];
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label
        htmlFor="role"
        className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Rol del Usuario
        {required && <span className="text-red-600"> *</span>}
      </label>
      <select
        id="role"
        name="role"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        required={required}
        defaultValue={defaultValue}
      >
        {customRoles.map((rol) => (
          <option
            key={rol.value ? `${rol.id}-${rol.value}` : `${rol.id}-select`}
            value={rol.value}
          >
            {rol.label}
          </option>
        ))}
      </select>
      {errors && (
        <InlineErrors key="rol-error" errorId="rol-error" errors={errors} />
      )}
    </div>
  );
}
