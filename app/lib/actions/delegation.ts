"use server";

import { DelegationState } from "@/app/lib/config/stateConfigs";
import {
  CreateDelegationAction,
  DeleteDelegationAction,
  UpdateDelegationAction,
} from "@/app/lib/actions/services/delegation";

export async function createDelegation(
  prevState: DelegationState,
  formData: FormData,
): Promise<DelegationState> {
  const action = new CreateDelegationAction();
  return action.execute(prevState, formData);
}

export async function updateDelegation(
  id: string,
  prevState: DelegationState,
  formData: FormData,
): Promise<DelegationState> {
  const action = new UpdateDelegationAction(id);
  return action.execute(prevState, formData);
}

export async function deleteDelegation(id: string): Promise<DelegationState> {
  const action = new DeleteDelegationAction(id);
  return action.execute();
}
