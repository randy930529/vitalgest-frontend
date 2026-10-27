"use client";

import { startTransition, useActionState } from "react";
import clsx from "clsx";
import { GuardType } from "@/app/lib/definitions";
import { initGuard } from "@/app/lib/actions/guard";
import { useFormNotifications } from "@/app/lib/hooks/useFormNotifications";
import { Badge, BadgeVariant } from "@/app/ui/components/badges";
import { Button } from "@/app/ui/button";

type InitGuardTriggerProps = {
  guard: GuardType;
  isBadge?: boolean;
};

export default function InitGuardTrigger({
  guard,
  isBadge,
}: InitGuardTriggerProps) {
  const initialState = { errors: {}, message: null };
  const initGuardAction = initGuard.bind(null, guard.id, guard);
  const [stateInitialized, actionInitGuard, isLoadingInitialized] =
    useActionState(initGuardAction, initialState);

  useFormNotifications({
    state: stateInitialized,
  });

  function handleInitGuard() {
    startTransition(() => {
      actionInitGuard();
    });
  }

  if (isBadge) {
    return (
      <ButtonBadge
        onClick={handleInitGuard}
        disabled={isLoadingInitialized}
        isLoading={isLoadingInitialized}
      />
    );
  }

  return (
    <Button
      type="submit"
      variant="formPrimary"
      onClick={handleInitGuard}
      disabled={isLoadingInitialized}
      isLoading={isLoadingInitialized}
    >
      Iniciar Guardia
    </Button>
  );
}

type ButtonBadgeProps = {
  variant?: BadgeVariant;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

function ButtonBadge({
  variant = "neutral",
  onClick,
  disabled,
  isLoading,
}: ButtonBadgeProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Iniciar Guardia"
      additionalClassName={clsx(
        "!px-0 !py-0 group relative inline-flex min-h-6 min-w-20 overflow-hidden focus:outline-none rounded-lg bg-transparent hover:bg-transparent",
        {
          "opacity-50 cursor-not-allowed": isLoading || disabled,
        },
      )}
    >
      {isLoading ? (
        <p className="bg-transparent text-xs font-medium text-slate-700">
          Iniciando...
        </p>
      ) : (
        <>
          <Badge
            title="Nueva"
            variant={variant}
            extraClassName="min-w-20 transition duration-500 ease-in-out group-hover:animate-pulse group-hover:border-orange-300 group-hover:bg-orange-500 group-hover:text-transparent"
          />
          <Badge
            title="Iniciar"
            variant={variant}
            extraClassName="min-w-20 absolute inset-0 -translate-x-full transition duration-500 ease-in-out group-hover:translate-x-0 group-hover:animate-pulse group-hover:bg-transparent group-hover:text-white group-hover:ring-0 group-hover:ring-transparent group-hover:border-transparent"
            hiddenIcon
          />
        </>
      )}
    </Button>
  );
}
