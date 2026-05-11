"use server";

import { File } from "buffer";
import { UploadSignatureState, UserState } from "@/app/lib/config/stateConfigs";
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
import { uploadImageToCloud } from "@/app/lib/utils";

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
  const signatureResult = await uploadSignature(
    userId,
    { errors: {}, message: null },
    formData,
  );

  if (signatureResult.errors) {
    return signatureResult;
  }

  if (signatureResult?.signature) {
    const signatureFile = formData.get("signatureFile") as unknown as File;
    const uploadResult = await uploadImageToCloud(
      signatureResult.signature.uploadUrl,
      signatureFile,
    );

    if (uploadResult.errors) {
      return uploadResult;
    }

    formData.append("key", signatureResult.signature.key);
    const updateSignatureAction = new UpdateSignatureAction(userId);
    const signatureState = await updateSignatureAction.execute(
      prevState,
      formData,
    );

    if (signatureState.errors) {
      return signatureState;
    }
  }

  const profileAction = new UpdateProfileAction(userId);
  return profileAction.execute(prevState, formData);
}

export async function uploadSignature(
  userId: string,
  prevState: UploadSignatureState,
  formData: FormData,
): Promise<UploadSignatureState> {
  const signatureFile = formData.get("signatureFile");

  if (!(signatureFile instanceof File)) return prevState;

  const { type, size } = signatureFile;
  const ext = type.split("/")[1];

  formData.append("mime", type);
  formData.append("ext", ext);
  formData.append("size", size.toString());

  const uploadSignatureAction = new UploadSignatureAction(userId);
  return uploadSignatureAction.execute(prevState, formData);
}

export async function updateUserPassword(
  userId: string,
  prevState: UserState,
  formData: FormData,
): Promise<UserState> {
  const passwordAction = new UpdateUserPasswordAction(userId);
  return passwordAction.execute(prevState, formData);
}
