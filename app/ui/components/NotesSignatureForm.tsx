"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { CustomOptions } from "@/app/lib/definitions";
import { FormSignature, FormTextarea } from "@/app/ui/dashboard/form-fields";
import { PaginationChecklist } from "@/app/ui/dashboard/pagination";

export type NotesSignatureFormProps = {
  children?: React.ReactNode;
  title?: string;
  usersOptions: (CustomOptions & { position?: string; email?: string })[];
  prepareAnswers: () => unknown;
  updateAction: (prevState: any, answers: any) => Promise<any>;
  signAction: (prevState: any, formData: FormData) => Promise<any>;
  onUpdateSuccess?: () => void;
  onSignSuccess?: () => void;
  link?: string;
};

export default function NotesSignatureForm({
  children,
  title,
  usersOptions,
  prepareAnswers,
  updateAction,
  signAction,
  onUpdateSuccess,
  onSignSuccess,
  link = "ambulances",
}: NotesSignatureFormProps) {
  const [signedDeliver, setSignedDeliver] = useState(false);
  const [signedReceive, setSignedReceive] = useState(false);

  const isSubmitDisabled = !(signedDeliver && signedReceive);

  const initialState = { errors: {}, message: null };
  const [state, formAction] = useActionState(updateAction, initialState);
  const [stateSign, formActionSign] = useActionState(signAction, initialState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.message) {
      toast.success(state.message);
      onUpdateSuccess?.();
      state.message = null;
    }
  }, [onUpdateSuccess, state.message]);

  useEffect(() => {
    if (stateSign.message) {
      toast.success(stateSign.message);
      stateSign.message = null;
      onSignSuccess?.();
    }
  }, [onSignSuccess, stateSign.message]);

  useEffect(() => {
    if (state.errors?.success) {
      state.errors.success.map((error: string) => toast.error(error));
    }
    if (state.errors?.answers) {
      state.errors.answers.map((error: string) => toast.error(error));
    }
  }, [state.errors?.success, state.errors?.answers]);

  useEffect(() => {
    if (stateSign.errors?.success) {
      stateSign.errors.success.map((error: string) => toast.error(error));
    }
    if (stateSign.errors?.notes) {
      stateSign.errors.notes.map((error: string) => toast.error(error));
    }
    if (stateSign.errors?.recipientId) {
      stateSign.errors.recipientId.map((error: string) => toast.error(error));
    }
  }, [
    stateSign.errors?.success,
    stateSign.errors?.notes,
    stateSign.errors?.recipientId,
  ]);

  function handleSubmit(formData: FormData) {
    if (isSubmitDisabled) return;

    const answers = prepareAnswers();
    startTransition(() => {
      formAction(answers);
      formActionSign(formData);
    });
  }

  return (
    <form
      action={handleSubmit}
      onSubmit={(event) => {
        if (isSubmitDisabled) {
          event.preventDefault();
        }
      }}
      className="grid grid-cols-1 md:grid-cols-4 auto-rows-auto gap-4 p-4 shadow-md sm:rounded-lg overflow-hidden"
    >
      <div className="p-4 md:col-span-1 md:row-span-1">{children}</div>

      <div className="flex flex-col gap-2 p-4 md:col-span-3 md:row-span-1">
        <h2 className="relative left-4 -top-4 w-[90%] text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
          {title}
          <span className="inline-block align-middle ms-2">
            <InformationCircleIcon className="w-5 h-5 bg-sky-950 text-white font-extrabold rounded-full" />
          </span>
        </h2>

        <FormTextarea key="write-notes" name="notes" rows={10} />

        <div className="flex flex-col gap-4 md:flex-row md:gap-20">
          <div className="flex flex-col gap-2 md:w-1/2 md:p-4">
            <FormSignature
              key="write-out-signature"
              name="write-out-signature"
              title="Entrega:"
              usersOptions={[
                { id: "", value: "", label: "Seleccione quien entrega" },
                ...usersOptions,
              ]}
              onSignedChange={setSignedDeliver}
            />
          </div>

          <div className="flex flex-col gap-2 md:w-1/2 md:p-4">
            <FormSignature
              key="write-in-signature"
              name="write-in-signature"
              title="Recibe:"
              usersOptions={[
                { id: "", value: "", label: "Seleccione quien recibe" },
                ...usersOptions,
              ]}
              onSignedChange={setSignedReceive}
            />
          </div>
        </div>
      </div>

      <div className="md:p-4 md:col-span-4 md:row-span-1">
        <PaginationChecklist
          isLast
          link={link}
          submitDisabled={isSubmitDisabled || isPending}
        />
      </div>
    </form>
  );
}
