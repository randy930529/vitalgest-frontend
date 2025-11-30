"use client";

import { useActionState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import ModalTrigger from "../button-modal";
import { Button } from "../button";
import { StateType } from "@/app/lib/definitions";

export default function TableActionDelete({
  id,
  title,
  question,
  details,
  actionDelete,
}: {
  id: string;
  title: string;
  question?: string;
  details?: string;
  actionDelete: (id: string, prevState: StateType<{}>) => Promise<void | any>;
}) {
  return (
    <ModalTrigger
      title={title}
      type="delete"
      question={question}
      details={details}
      modelContent={<DeleteForm actionDelete={actionDelete} id={id} />}
      buttonToggle={<ButtonToggleDelete />}
    />
  );
}

function DeleteForm({
  id,
  actionDelete,
  onClose,
}: {
  id: string;
  actionDelete: (id: string, prevState: StateType<{}>) => Promise<void | any>;
  onClose?: () => void;
}) {
  const initialState = { errors: {}, message: null };
  const deleteUserWithId = actionDelete.bind(null, id);
  const [state, formAction] = useActionState(deleteUserWithId, initialState);

  useEffect(() => {
    if (state.message) {
      toast.success(state.message);
      onClose && onClose();
    }
  }, [state.message]);

  useEffect(() => {
    state.errors?.success &&
      state.errors?.success.map((error: string) => toast.error(error));
  }, [state.errors?.success]);

  function handleSubmit() {
    formAction();
    state.message = "Eliminado exitosamente.";
  }

  return (
    <form action={handleSubmit}>
      <div className="w-full flex justify-end gap-4">
        <Button
          type="reset"
          onMouseDown={onClose}
          className="text-white inline-flex items-center bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          id={`user-${id}-delete`}
          className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Aceptar
        </Button>
      </div>
    </form>
  );
}

function ButtonToggleDelete({ onClose }: { onClose?: () => void }) {
  return (
    <button
      type="submit"
      className="rounded-md border p-2 mr-2 bg-red-200 hover:bg-red-300"
      onClick={onClose}
    >
      <span className="sr-only">Eliminar</span>
      <TrashIcon className="w-5" />
    </button>
  );
}
