"use server";

import { GuardType } from "@/app/lib/definitions";
import { GuardState } from "@/app/lib/config/stateConfigs";
import {
  GuardSetStateAction,
  CreateGuardAction,
  DeleteGuardAction,
  UpdateGuardAction,
} from "@/app/lib/actions/services/guard";

export async function createGuard(
  prevState: GuardState,
  formData: FormData,
): Promise<GuardState> {
  const action = new CreateGuardAction();
  return action.execute(prevState, formData);
}

export async function updateGuard(
  id: string,
  prevState: GuardState,
  formData: FormData,
): Promise<GuardState> {
  const action = new UpdateGuardAction(id);
  return action.execute(prevState, formData);
}

export async function deleteGuard(id: string): Promise<GuardState> {
  const action = new DeleteGuardAction(id);
  return action.execute();
}

export async function initGuard(
  id: string,
  guard: GuardType,
  prevState: GuardState,
): Promise<GuardState> {
  const action = new GuardSetStateAction(id, guard, "En curso");
  return action.execute(prevState);
}

export async function closeGuard(
  id: string,
  guard: GuardType,
  prevState: GuardState,
): Promise<GuardState> {
  const action = new GuardSetStateAction(id, guard, "Cerrada");
  return action.execute(prevState);
}
