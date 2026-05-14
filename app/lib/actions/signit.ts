"use server";

import { VerifySignatureResult } from "@/app/lib/definitions";
import { getLoggedInUser } from "@/app/lib/dal";
import { fetchUserById } from "@/app/lib/data/users";
import createSignatureURL from "@/app/lib/utils";

export async function verifySignature(
  prevState: VerifySignatureResult,
  formData: FormData,
): Promise<VerifySignatureResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    return { approved: false, error: "Por favor ingrese la contraseña." };
  }

  const result = await getLoggedInUser(email, password);

  if (!result) {
    return { approved: false, error: "Contraseña incorrecta." };
  }

  const [userSignature] = result;
  const user = await fetchUserById(userSignature.id);
  const signatureUrl =
    createSignatureURL(user?.signature || "") ||
    "/images/logo-vital-gest_red.svg";

  return { approved: true, signatureUrl };
}
