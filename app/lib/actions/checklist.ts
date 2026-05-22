"use server";

import {
  ChecklistAnswersType,
  AnswersChecklistSupplyType,
} from "@/app/lib/definitions";
import {
  ChecklistState,
  ChecklistAnswersState,
  ChecklistSuppliesState,
} from "@/app/lib/config/stateConfigs";
import {
  CreateChecklistAmbulanceAction,
  CreateChecklistSuppliesAction,
  SignCheckListAction,
  UpdateAnswersCheckListAmbulanceAction,
  UpdateCheckListSupplyAnswersAction,
} from "@/app/lib/actions/services/checklist";

export async function createChecklistAmbulance(
  prevState: ChecklistState,
  formData: FormData,
): Promise<ChecklistState> {
  const action = new CreateChecklistAmbulanceAction();
  return action.execute(prevState, formData);
}

export async function updateCheckListAmbulanceAnswers(
  id: string,
  prevState: ChecklistAnswersState,
  answers: ChecklistAnswersType[],
): Promise<ChecklistAnswersState> {
  const action = new UpdateAnswersCheckListAmbulanceAction(id, answers);
  return action.execute(prevState);
}

export async function signCheckListAmbulance(
  id: string,
  prevState: ChecklistState,
  formData: FormData,
): Promise<ChecklistState> {
  const endpoint = `/api/checklists/ambulance/${id}/sign`;
  console.log(id);
  const action = new SignCheckListAction(id, endpoint);
  return action.execute(prevState, formData);
}

export async function signCheckListSupply(
  id: string,
  prevState: ChecklistState,
  formData: FormData,
): Promise<ChecklistState> {
  const endpoint = `/api/checklists/supply/${id}/sign`;
  const action = new SignCheckListAction(id, endpoint);
  return action.execute(prevState, formData);
}

export async function createChecklistSupplies(
  prevState: ChecklistSuppliesState,
  formData: FormData,
): Promise<ChecklistSuppliesState> {
  const action = new CreateChecklistSuppliesAction();
  return action.execute(prevState, formData);
}

export async function updateCheckListSupplyAnswers(
  id: string,
  prevState: ChecklistAnswersState,
  answers: AnswersChecklistSupplyType[],
): Promise<ChecklistAnswersState> {
  const action = new UpdateCheckListSupplyAnswersAction(id, answers);
  return action.execute(prevState);
}
