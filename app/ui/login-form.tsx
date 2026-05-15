"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AtSymbolIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { login } from "@/app/lib/actions/auth";
import { STYLES } from "@/app/lib/config/constants";
import { Button } from "@/app/ui/button";
import { PasswordInput } from "@/app/ui/components/password-input";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [errorMessage, formLoginAction, isLoading] = useActionState(
    login,
    undefined,
  );
  return (
    <form action={formLoginAction} className="space-y-3">
      <div
        className={clsx(
          "flex-1 rounded-lg bg-gray-50 px-6 py-4",
          STYLES.boxShadow,
        )}
      >
        <div className="w-full">
          <div>
            <label
              className="mb-3 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Correo
            </label>
            <div className="relative">
              <input
                className={clsx(
                  "peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500",
                  STYLES.inputFocus,
                )}
                id="email"
                type="email"
                name="email"
                placeholder="Ingrese su correo electrónico"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <PasswordInput
              id="password"
              name="password"
              required
              minLength={6}
            />
          </div>
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <Button
          className="text-white inline-flex items-center bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-700 w-full mt-6"
          aria-disabled={isLoading}
          isLoading={isLoading}
          disabled={isLoading}
          type="submit"
        >
          Iniciar Sesión
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div className="flex h-8 items-end space-x-1">
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
