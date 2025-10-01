"use client";

import { useActionState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DelegationState, updateDelegation } from "@/app/lib/actions";
import { DelegationType } from "@/app/lib/definitions";
import { Button } from "@/app/ui/button";

export default function DelegationEditForm({
  delegation,
  customStates,
  customMunicipalities,
}: {
  delegation: DelegationType;
  customStates: {
    id: string;
    value: string;
    label: string;
  }[];
  customMunicipalities: {
    id: number;
    value: number;
    label: string;
  }[];
}) {
  // <div>(Component) Formulario de delegación - [CSR]</div>

  const initialState: DelegationState = { errors: {}, message: null };
  const updateDelegationWithId = updateDelegation.bind(
    null,
    delegation?.id || ""
  );
  const [state, formAction] = useActionState(
    updateDelegationWithId,
    initialState
  );
  console.log(state.errors);

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  const handleOption = (name: string, value: string) => {
    console.log(`Options... ${name} ${value}`);

    params.set(name, `${delegation?.id || ""}`);

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white mt-7 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
      <div className="flex md:flex-row items-center justify-center md:space-y-0 p-4">
        <form action={formAction}>
          {state.message}
          <div className="grid gap-4 mb-4 sm:grid-cols-1">
            <div>
              <label
                htmlFor="name"
                className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Delegación
              </label>
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={delegation?.name}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Delegación Ameca, Jalisco"
                required
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Estado
              </label>
              <select
                id="state"
                name="state"
                defaultValue={delegation?.state?.id}
                onChange={(e) => {
                  handleOption(e.target.name, e.target.value);
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              >
                {customStates.map((state) => (
                  <option key={state.id} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
              <div id="rol-error" aria-live="polite" aria-atomic="true">
                {state.errors?.state &&
                  state.errors.state.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="role"
                className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Municipio
              </label>
              <select
                id="municipality"
                name="municipality"
                defaultValue={delegation?.municipality?.id}
                onChange={(e) => {
                  handleOption(e.target.name, e.target.value);
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              >
                {customMunicipalities.map((state) => (
                  <option key={state.id} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
              <div id="rol-error" aria-live="polite" aria-atomic="true">
                {state.errors?.municipality &&
                  state.errors.municipality.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Link
              href="/dashboard/delegations"
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
