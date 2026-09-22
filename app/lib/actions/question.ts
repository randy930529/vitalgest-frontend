"use server";

import { QuestionState } from "@/app/lib/config/stateConfigs";
import {
  CreateQuestionAction,
  DeleteQuestionAction,
  UpdateQuestionAction,
} from "@/app/lib/actions/services/question";

export async function createQuestion(
  prevState: QuestionState,
  formData: FormData,
): Promise<QuestionState> {
  const action = new CreateQuestionAction();
  return action.execute(prevState, formData);
}

export async function updateQuestion(
  id: string,
  prevState: QuestionState,
  formData: FormData,
): Promise<QuestionState> {
  const action = new UpdateQuestionAction(id);
  return action.execute(prevState, formData);
}

export async function deleteQuestion(id: string): Promise<QuestionState> {
  const action = new DeleteQuestionAction(id);
  return action.execute();
}
