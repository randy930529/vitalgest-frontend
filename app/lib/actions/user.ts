"use server";

import { File } from "buffer";
import { UserState } from "@/app/lib/config/stateConfigs";
import {
  CreateUserAction,
  DeleteUserAction,
  UpdateUserAction,
} from "@/app/lib/actions/services/user";
import {
  UpdateProfileAction,
  UpdateSignatureAction,
  UpdateUserPasswordAction,
  UploadSignatureAction,
} from "@/app/lib/actions/services/profile";

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
  userId: string,
  prevState: UserState,
  formData: FormData,
): Promise<UserState> {
  const signatureFile = formData.get("signatureFile");
  if (signatureFile instanceof File) {
    const { type, size } = signatureFile;
    const ext = type.split("/")[1];

    formData.append("mime", type);
    formData.append("ext", ext);
    formData.append("size", size.toString());

    const uploadSignatureAction = new UploadSignatureAction(userId);
    const signatureResult = await uploadSignatureAction.execute(
      prevState,
      formData,
    );

    if (signatureResult.message && signatureResult.signature) {
      formData.append("key", signatureResult.signature.key);
      const updateSignatureAction = new UpdateSignatureAction(userId);
      await updateSignatureAction.execute(prevState, formData);
    }
  }

  const profileAction = new UpdateProfileAction(userId);
  return profileAction.execute(prevState, formData);
}

export async function updateUserPassword(
  userId: string,
  prevState: UserState,
  formData: FormData,
): Promise<UserState> {
  const passwordAction = new UpdateUserPasswordAction(userId);
  return passwordAction.execute(prevState, formData);
}
