"use server";

import { AmbulanceState } from "@/app/lib/config/stateConfigs";
import {
  CreateAmbulanceAction,
  DeleteAmbulanceAction,
  UpdateAmbulanceAction,
} from "@/app/lib/actions/services/ambulance";

export async function createAmbulance(
  prevState: AmbulanceState,
  formData: FormData,
): Promise<AmbulanceState> {
  const action = new CreateAmbulanceAction();
  return action.execute(prevState, formData);
}

export async function updateAmbulance(
  id: string,
  prevState: AmbulanceState,
  formData: FormData,
): Promise<AmbulanceState> {
  const action = new UpdateAmbulanceAction(id);
  return action.execute(prevState, formData);
}

export async function deleteAmbulance(id: string): Promise<AmbulanceState> {
  const action = new DeleteAmbulanceAction(id);
  return action.execute();
}
