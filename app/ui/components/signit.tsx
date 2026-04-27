"use client";

import { useEffect, useState, useTransition } from "react";
import { useActionState } from "react";
import clsx from "clsx";
import { CameraIcon } from "@heroicons/react/24/outline";
import { verifySignature } from "@/app/lib/actions/signit";
import { Button } from "@/app/ui/button";
import { VerifySignatureResult } from "@/app/lib/definitions";

export default function Signit({
  email,
  onSignedChange,
}: {
  email: string;
  onSignedChange?: (signed: boolean) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  const initialState: VerifySignatureResult = {
    approved: false,
  };

  const [state, action] = useActionState(verifySignature, initialState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.approved && state.signatureUrl) {
      setSignedUrl(state.signatureUrl);
      setShowForm(false);
      setPassword("");
    }
  }, [state.approved, state.signatureUrl]);

  useEffect(() => {
    setSignedUrl(null);
    setShowForm(false);
    setPassword("");
  }, [email]);

  useEffect(() => {
    onSignedChange?.(!!signedUrl);
  }, [onSignedChange, signedUrl]);

  function handleSubmit() {
    const formData = new FormData();
    formData.set("email", email || "");
    formData.set("password", password);

    startTransition(() => {
      action(formData);
    });
  }

  const canSign = email && email.length > 0;

  return (
    <div
      className={clsx(
        "group flex flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed p-5 text-center transition",
        signedUrl
          ? "border-slate-200 bg-white shadow-[0_18px_40px_-32px_rgba(15,23,42,0.35)] hover:border-rose-300 hover:bg-slate-50/70"
          : showForm
            ? "border-slate-200 bg-white shadow-[0_18px_40px_-32px_rgba(15,23,42,0.35)]"
            : "border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,1))] shadow-[0_18px_40px_-32px_rgba(15,23,42,0.35)] hover:border-rose-300 hover:bg-slate-50/70",
      )}
    >
      {signedUrl ? (
        <div className="relative flex w-full items-center justify-center rounded-[22px] bg-[radial-gradient(circle_at_top,_rgba(254,242,242,0.9),_rgba(255,255,255,1)_58%)] p-5">
          <img
            src={signedUrl}
            alt="Firma"
            className="h-24 w-auto object-contain"
          />
          <div className="absolute bottom-3 right-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:text-rose-600"
              onClick={() => {
                setSignedUrl(null);
                setShowForm(false);
                state.approved = false;
                state.signatureUrl = undefined;
                state.error = undefined;
              }}
            >
              <CameraIcon className="h-4 w-4 text-rose-500" />
              Reiniciar
            </button>
          </div>
        </div>
      ) : showForm ? (
        <div className="w-full flex flex-col gap-3">
          <input type="hidden" name="email" value={email} />
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-900 dark:text-white"
          >
            Ingrese su contraseña para firmar
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="block h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
          />

          {state.error && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {state.error}
            </p>
          )}

          <div className="flex w-full justify-between gap-2">
            <Button
              type="button"
              variant="formSecondary"
              onClick={() => {
                setShowForm(false);
                setPassword("");
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="formPrimary"
              onClick={handleSubmit}
              disabled={!canSign || isPending}
            >
              {isPending ? "Firmando..." : "Confirmar firma"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Button
            type="button"
            variant="formPrimary"
            className="group-hover:bg-rose-500"
            onClick={() => setShowForm(true)}
            disabled={!canSign}
          >
            Firmar
          </Button>
          {!canSign && (
            <p className="max-w-sm text-sm leading-6 text-slate-500">
              Seleccione una persona para habilitar la firma.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
