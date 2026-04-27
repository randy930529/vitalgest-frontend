"use server";

import { ShiftState } from "@/app/lib/config/stateConfigs";
import {
  CreateShiftAction,
  DeleteShiftAction,
  UpdateShiftAction,
} from "@/app/lib/actions/services/shift";

export async function createShift(
  prevState: ShiftState,
  formData: FormData,
): Promise<ShiftState> {
  const action = new CreateShiftAction();
  return action.execute(prevState, formData);
}

export async function updateShift(
  id: string,
  prevState: ShiftState,
  formData: FormData,
): Promise<ShiftState> {
  const action = new UpdateShiftAction(id);
  return action.execute(prevState, formData);
}

export async function deleteShift(id: string): Promise<ShiftState> {
  const action = new DeleteShiftAction(id);
  return action.execute();
}
