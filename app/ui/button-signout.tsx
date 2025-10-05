"use client";

import { PowerIcon } from "@heroicons/react/24/outline";
import { useActionState } from "react";
import { unAuthenticate } from "../lib/actions";

export default function ButtonSignout() {
  const [errorMessage, formSignOutAction, isPending] = useActionState(
    unAuthenticate,
    undefined
  );

  return (
    <form action={formSignOutAction}>
      <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
        <PowerIcon className="w-6" />
        <div className="hidden md:block">Salir</div>
      </button>
    </form>
  );
}

export function LinkSignout() {
  const [errorMessage, formSignOutAction, isPending] = useActionState(
    unAuthenticate,
    undefined
  );

  return (
    <form action={formSignOutAction}>
      <button className="block w-full py-2 px-4 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
        Salir
      </button>
    </form>
  );
}
