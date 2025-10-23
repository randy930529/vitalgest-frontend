"use client";

import { useActionState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function TableActionDelete({
  id,
  actionDelete,
}: {
  id: string;
  actionDelete: (id: string) => Promise<void | any>;
}) {
  const initialState = { errors: {}, message: null };
  const deleteUserWithId = actionDelete.bind(null, id);
  const [state, formAction] = useActionState(deleteUserWithId, initialState);

  useEffect(() => {
    state?.message && toast.success(state.message) && (state.message = null);
  }, [state?.message]);

  useEffect(() => {
    state?.errors?.success &&
      state?.errors?.success.map((error: string) => toast.error(error));
  }, [state?.errors?.success]);

  return (
    <form action={formAction}>
      <button
        type="submit"
        id={`user-${id}-delete`}
        className="rounded-md border p-2 mr-2 bg-red-200 hover:bg-red-300"
      >
        <span className="sr-only">Eliminar</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
