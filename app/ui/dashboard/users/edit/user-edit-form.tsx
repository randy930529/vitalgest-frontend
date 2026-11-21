"use client";

import { useActionState } from "react";
import { notFound, useRouter } from "next/navigation";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { DelegationType, UserType } from "@/app/lib/definitions";
import { UserState } from "@/app/lib/config/stateConfigs";
import { ROLE_MANAGER } from "@/app/lib/config/constants";
import { updateUser } from "@/app/lib/actions/user";
import { useFormNotifications } from "@/app/lib/hooks/useFormNotifications";
import { PasswordInput } from "@/app/ui/components/password-input";
import { FormInput } from "@/app/ui/dashboard/form-fields";
import { InlineErrors } from "@/app/ui/custom-errors";
import { FormButtons } from "@/app/ui/button";
import DelegationsSelector from "@/app/ui/dashboard/delegations/delegations-selector";

const customFormInput = {
  name: { type: "text", title: "Nombre", required: true },
  lastname: { type: "text", title: "Apellidos", required: true },
  email: { type: "email", title: "Correo Electrónico", required: true },
  password: { type: "password", title: "Contraseña", required: false },
  position: { type: "text", title: "Cargo Laboral", required: true },
};

export default function UserEditForm({
  data,
}: {
  data: [UserType | undefined, DelegationType[]];
}) {
  // (Component) Formulario de usuario - [CSR]

  const router = useRouter();
  const [user, delegations] = data;

  if (!user) {
    notFound();
  }

  const initialState: UserState = { errors: {}, message: null };
  const updateUserWithId = updateUser.bind(null, user?.id || "");
  const [state, formAction, isLoading] = useActionState(
    updateUserWithId,
    initialState,
  );

  useFormNotifications({
    state,
  });

  return (
    <main className="bg-white mt-7 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
      <h2 className="flex gap-2 items-center ms-6 text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
        <PencilSquareIcon className="w-6 h-6" />
        {`${user?.name} ${user?.lastname}`}
      </h2>
      <p className="ms-6 font-semibold text-gray-500 dark:text-gray-400 text-center md:text-left">
        {user?.email}
      </p>
      <div className="flex md:flex-row items-center justify-center md:space-y-0 p-4">
        <form action={formAction}>
          <div className="grid gap-4 mb-4 sm:grid-cols-2">
            {Object.keys(customFormInput)
              .filter((key) => key === "name" || key === "lastname")
              .map((name) => (
                <FormInput
                  key={name}
                  name={name}
                  initialValue={user?.[name as "name" | "lastname"]}
                  errors={state.errors?.[name as "name" | "lastname"]}
                  customFormInput={customFormInput}
                />
              ))}

            <FormInput
              key="email"
              name="email"
              initialValue={user?.email}
              errors={state.errors?.email}
              customFormInput={customFormInput}
            />

            <PasswordInput
              key="password"
              id="password"
              name="password"
              minLength={6}
              errors={state.errors?.password}
              placeholder="Contraseña"
              defaultValue=""
              classNameLabel="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
              classNameInput="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full py-[9px] pl-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />

            {delegations && (
              <DelegationsSelector
                delegations={delegations}
                defaultValue={user.delegation.id}
                errors={state.errors?.delegation}
              />
            )}

            <FormInput
              key="position"
              name="position"
              initialValue={user?.position}
              errors={state.errors?.position}
              customFormInput={customFormInput}
            />

            <UserRolesSelect
              errors={state.errors?.role}
              defaultValue={user?.role}
              required
            />

            <UserStatusChecked status={user?.status} />
          </div>
          <FormButtons
            onCancel={() => router.push("/dashboard/users")}
            submitText="Guardar"
            cancelText="Regresar"
            isLoading={isLoading}
          />
        </form>
      </div>
    </main>
  );
}

function UserStatusChecked({
  status,
}: {
  status: boolean | string | undefined;
}) {
  const isChecked = typeof status === "string" ? status === "true" : status;

  return (
    <div className="flex items-center mt-4 mb-2">
      <label
        htmlFor="status"
        className="block me-4 text-sm font-medium text-gray-900 dark:text-white"
      >
        Estado
      </label>
      <input
        type="checkbox"
        name="status"
        id="status"
        defaultChecked={isChecked}
        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
    </div>
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
        {ROLE_MANAGER.selectOptions().map((rol) => (
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
