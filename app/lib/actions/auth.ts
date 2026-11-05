"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { getPostLoginRedirect } from "@/auth.config";
import { getSession } from "@/app/lib/dal";
import { deleteSession } from "@/app/lib/session";

export async function login(prevState: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    const session = await getSession();
    if (!session) {
      return "No se pudo crear la sesión.";
    }

    redirect(
      getPostLoginRedirect(
        session.user.role,
        formData.get("callbackUrl")?.toString(),
      ),
    );
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
