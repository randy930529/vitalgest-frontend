"use server";

import { UserState } from "@/app/lib/config/stateConfigs";
import {
  CreateUserAction,
  DeleteUserAction,
  UpdateProfileAction,
  UpdateUserAction,
} from "@/app/lib/actions/services/user";

export async function createUser(
  prevState: UserState,
  formData: FormData,
): Promise<UserState> {
  const action = new CreateUserAction();
  return action.execute(prevState, formData);
}

export async function updateUser(
  id: string,
  prevState: UserState,
  formData: FormData,
): Promise<UserState> {
  const action = new UpdateUserAction(id);
  return action.execute(prevState, formData);
}

export async function deleteUser(id: string): Promise<UserState> {
  const action = new DeleteUserAction(id);
  return action.execute();
}

export async function updateProfile(
  prevState: UserState,
  formData: FormData,
): Promise<UserState> {
  const action = new UpdateProfileAction();
  return action.execute(prevState, formData);
}
