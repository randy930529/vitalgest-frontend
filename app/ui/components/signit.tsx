"use client";

import { useEffect, useState, useTransition } from "react";
import { useActionState } from "react";
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
  console.log(canSign, email);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center gap-3">
      {signedUrl ? (
        <div className="flex flex-col items-center gap-3">
          <img
            src={signedUrl}
            alt="Firma"
            className="h-20 w-auto object-contain"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSignedUrl(null);
                setShowForm(false);
                state.approved = false;
                state.signatureUrl = undefined;
                state.error = undefined;
              }}
            >
              Reiniciar
            </Button>
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          />

          {state.error && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {state.error}
            </p>
          )}

          <div className="flex w-full justify-between gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                setPassword("");
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
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
            variant="primary"
            onClick={() => setShowForm(true)}
            disabled={!canSign}
          >
            Firmar
          </Button>
          {!canSign && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Seleccione una persona para habilitar la firma.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
