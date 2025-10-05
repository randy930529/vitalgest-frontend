import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { createSession } from "./app/lib/session";
import { getLoggedInUser } from "./app/lib/dal";

const userCredentials = {
  email: z
    .string()
    .email({ message: "Por favor ingrese un correo electrónico válido." })
    .trim(),
  password: z
    .string({
      required_error: "La contraseña es obligatoria.",
    })
    .min(8, { message: "Debe tener al menos 8 caracteres." })
    .regex(/[a-zA-Z]/, {
      message: "Debe contener al menos una mayúscula y una minúscula.",
    })
    .regex(/[0-9]/, { message: "Debe contener al menos un número." })
    .regex(/[@$!%#?&]/, {
      message: "Debe contener al menos un carácter especial.",
    })
    .trim(),
};

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object(userCredentials)
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const result = await getLoggedInUser(email, password);
          if (!result) return null;

          const [user, accessToken, refreshToken] = result;
          await createSession(user, accessToken, refreshToken);

          return user;
        }

        return null;
      },
    }),
  ],
});
