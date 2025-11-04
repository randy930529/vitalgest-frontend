"use client";

import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { CustomOptions, ShiftType } from "@/app/lib/definitions";
import { createShift, ShiftState } from "@/app/lib/actions/shift.action";
import { Button } from "@/app/ui/button";
import { CardWrapper } from "@/app/ui/cards";
import { FormSelect } from "@/app/ui/dashboard/form-fields";

export default function AmbulanceAssignForm({
  guardId,
  ambulances,
  drivers,
  paramedicals,
  setShifts,
}: {
  guardId: string;
  ambulances: CustomOptions[];
  drivers: CustomOptions[];
  paramedicals: CustomOptions[];
  setShifts?: Dispatch<SetStateAction<ShiftType[]>>;
}) {
  // (Component) Formulario de asignar turnos - [CSR]

  const initialState: ShiftState = { errors: {}, message: null };
  const [state, formAction] = useActionState(createShift, initialState);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (state.message) {
      toast.success(state.message);
      if (state.shift && setShifts) {
        setShifts((currentState) => [
          ...currentState,
          state.shift as ShiftType,
        ]);
      }
    }
    return () => {
      state.message = null;
    };
  }, [state.message]);

  useEffect(() => {
    state.errors?.success &&
      state.errors?.success.map((error: string) => toast.error(error));
  }, [state.errors?.success]);

  if (!showForm) {
    return (
      <Button
        type="button"
        onClick={() => setShowForm(true)}
        className="inline-flex max-w-xs items-center border border-gray-400 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center dark:text-white dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        Agragar Turnos
      </Button>
    );
  }

  return (
    <form action={formAction} className="my-4">
      <input
        type="text"
        name="guard"
        defaultValue={guardId}
        className="hidden"
      />
      <CardWrapper isColumn>
        <FormSelect
          key="ambulance"
          name="ambulance"
          title="Ambulancia"
          options={[
            { id: "", label: "Seleccione Ambulancia", value: "" },
            ...ambulances,
          ]}
          required
        />
        <div className="flex flex-col w-full md:flex-row md:justify-between">
          <FormSelect
            key="driver"
            name="driver"
            title="Chofer"
            options={[
              { id: "", label: "Seleccione Chofer", value: "" },
              ...drivers,
            ]}
            required
          />
          <FormSelect
            key="paramedical"
            name="paramedical"
            title="Paramédico"
            options={[
              { id: "", label: "Seleccione Paramédico", value: "" },
              ...paramedicals,
            ]}
            required
          />
        </div>
        <div className="w-full flex justify-end gap-4 mt-4">
          <Button
            type="reset"
            onClick={() => setShowForm(false)}
            className="text-white inline-flex items-center bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Guardar
          </Button>
        </div>
      </CardWrapper>
    </form>
  );
}
