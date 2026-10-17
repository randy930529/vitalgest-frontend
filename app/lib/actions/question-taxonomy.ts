"use server";

import {
  QuestionCategoryState,
  QuestionSubcategoryState,
} from "@/app/lib/config/stateConfigs";
import {
  CreateQuestionCategoryAction,
  CreateQuestionSubcategoryAction,
  DeleteQuestionCategoryAction,
  DeleteQuestionSubcategoryAction,
  UpdateQuestionCategoryAction,
  UpdateQuestionSubcategoryAction,
} from "@/app/lib/actions/services/question-taxonomy";

export async function createQuestionCategory(
  prevState: QuestionCategoryState,
  formData: FormData,
) {
  return new CreateQuestionCategoryAction().execute(prevState, formData);
}

export async function updateQuestionCategory(
  id: string,
  prevState: QuestionCategoryState,
  formData: FormData,
) {
  return new UpdateQuestionCategoryAction(id).execute(prevState, formData);
}

export async function deleteQuestionCategory(id: string) {
  return new DeleteQuestionCategoryAction(id).execute();
}

export async function createQuestionSubcategory(
  prevState: QuestionSubcategoryState,
  formData: FormData,
) {
  return new CreateQuestionSubcategoryAction().execute(prevState, formData);
}

export async function updateQuestionSubcategory(
  id: string,
  prevState: QuestionSubcategoryState,
  formData: FormData,
) {
  return new UpdateQuestionSubcategoryAction(id).execute(prevState, formData);
}

export async function deleteQuestionSubcategory(id: string) {
  return new DeleteQuestionSubcategoryAction(id).execute();
}
