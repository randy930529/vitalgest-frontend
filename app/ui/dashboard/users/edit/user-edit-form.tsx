"use client";

import { useActionState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { updateUser, UserState } from "@/app/lib/actions/user";
import { DelegationType, UserType } from "@/app/lib/definitions";
import { Button } from "@/app/ui/button";
import { FormInput } from "@/app/ui/dashboard/form-fields";
import { UserRolesSelect } from "@/app/ui/dashboard/users/create/user-form";
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
  // <div>(Component) Formulario de usuario - [CSR]</div>

  const [user, delegations] = data;

  if (!user) {
    notFound();
  }

  const initialState: UserState = { errors: {}, message: null };
  const updateUserWithId = updateUser.bind(null, user?.id || "");
  const [state, formAction] = useActionState(updateUserWithId, initialState);

  useEffect(() => {
    state.message && toast.success(state.message) && (state.message = null);
  }, [state.message]);

  useEffect(() => {
    state.errors?.success &&
      state.errors?.success.map((error: string) => toast.error(error));
  }, [state.errors?.success]);

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
                    initialValue={
                      user?.[name as "email" | "password" | "position"]
                    }
                    errors={
                      state.errors?.[name as "email" | "password" | "position"]
                    }
                    customFormInput={customFormInput}
                  />
                ))}

              {delegations && (
                <DelegationsSelector
                  delegations={delegations}
                  defaultValue={user.delegationId}
                  errors={state.errors?.delegation}
                />
              )}

              <UserRolesSelect
                errors={state.errors?.role}
                defaultValue={user?.role}
                required
              />

              <UserStatusChecked status={user?.status} />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Link
              href="/dashboard/users"
              className="text-white inline-flex items-center bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Regresar
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
