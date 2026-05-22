import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ChecklistAnswersType,
  AnswersChecklistSupplyType,
} from "@/app/lib/definitions";

type ChecklistAmbulanceState = {
  answers: Record<string, ChecklistAnswersType[]>;
};

type ChecklistAmbulanceActions = {
  setAnswer: (id: string, valor: ChecklistAnswersType[]) => void;
  getAnswer: (id: string) => ChecklistAnswersType[] | undefined;
  reset: () => void;
};

type ChecklistAmbulanceStore = ChecklistAmbulanceState &
  ChecklistAmbulanceActions;

const initState: ChecklistAmbulanceState = {
  answers: {},
};

/**
 * Almacén Zustand para manejar las respuestas del checklist de ambulancia.
 * Utiliza persistencia para mantener los datos en el almacenamiento local.
 * Proporciona métodos para establecer, obtener y resetear respuestas.
 * La clave de persistencia es 'answers-checklist-ambulance'.
 */
export const useChecklistAmbulanceStore = create<ChecklistAmbulanceStore>()(
  persist<ChecklistAmbulanceStore>(
    (set, get) => ({
      ...initState,
      setAnswer: (id: string, valor: ChecklistAnswersType[]) =>
        set((state) => ({
          answers: { ...state.answers, [id]: valor },
        })),
      getAnswer: (id: string) => get().answers[id],
      reset: () => set({ ...initState }),
    }),
    { name: "answers-checklist-ambulance" },
  ),
);

type ChecklistSupplyState = {
  answers: Record<string, AnswersChecklistSupplyType[]>;
};

type ChecklistSupplyActions = {
  setAnswer: (id: string, valor: AnswersChecklistSupplyType[]) => void;
  getAnswer: (id: string) => AnswersChecklistSupplyType[] | undefined;
  reset: () => void;
};

type ChecklistSupplyStore = ChecklistSupplyState & ChecklistSupplyActions;

const initSupplyState: ChecklistSupplyState = {
  answers: {},
};

export const useChecklistSupplyStore = create<ChecklistSupplyStore>()(
  persist<ChecklistSupplyStore>(
    (set, get) => ({
      ...initSupplyState,
      setAnswer: (id: string, valor: AnswersChecklistSupplyType[]) =>
        set((state) => ({
          answers: { ...state.answers, [id]: valor },
        })),
      getAnswer: (id: string) => get().answers[id],
      reset: () => set({ ...initSupplyState }),
    }),
    { name: "answers-checklist-supply" },
  ),
);
