"use client";

import { useState } from "react";
import clsx from "clsx";
import { EyeIcon, EyeSlashIcon, KeyIcon } from "@heroicons/react/24/outline";
import { STYLES } from "@/app/lib/config/constants";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function PasswordInput({
  label = "Contraseña",
  error,
  id = "password",
  placeholder = "Ingrese su contraseña",
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full">
      {label && (
        <label
          className="mb-3 block text-xs font-medium text-gray-900"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={clsx(
            "peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 pr-10 text-sm outline-2 placeholder:text-gray-500",
            STYLES.inputFocus,
          )}
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...props}
        />
        <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 peer-focus:text-gray-900"
          aria-label={
            showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
          }
        >
          {showPassword ? (
            <EyeSlashIcon className="h-[18px] w-[18px]" />
          ) : (
            <EyeIcon className="h-[18px] w-[18px]" />
          )}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
