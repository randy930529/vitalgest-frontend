"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { deleteSession } from "@/app/lib/session";

export async function login(prevState: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Credenciales inválidas.";
        default:
          return "Ocurrió un error inesperado.";
      }
    }
    throw error;
  }
}

export async function logout() {
  await deleteSession();
  await signOut({ redirectTo: "/login" });
}
