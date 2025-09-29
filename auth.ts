import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import type { UserType } from "@/app/lib/definitions";
import { authConfig } from "./auth.config";
import { createSession } from "./app/lib/session";
import { getLoggedInUser } from "./app/lib/dal";

async function getUser(
  email: string,
  password: string
): Promise<UserType | undefined> {
  const endPoint = `${process.env.API_URL}/api/auth/login/user`;

  try {
    const response = await fetch(endPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    if (!response.ok) {
      console.log((await response.json())["error"]);
      return;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return;
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const result = await getLoggedInUser(email, password);
          if (!result) return null;

          const [user, accessToken, refreshToken] = result;
          await createSession(user, accessToken, refreshToken);

          return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
