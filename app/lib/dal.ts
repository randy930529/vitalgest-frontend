import "server-only";
import { cache } from "react";
import { SessionType, UserType } from "./definitions";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import { signOut } from "@/auth";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.user) {
    await signOut({ redirectTo: "/" });
  }

  const { user, accessToken, refreshToken } = (session || {}) as SessionType;

  return { isAuth: true, user, accessToken, refreshToken };
});

export const verifyAuthorization = cache((session: SessionType) => {
  if (!session?.isAuth && !session?.accessToken) {
    console.log("User NO autorizado");
    return false;
  }

  if (
    session?.isAuth &&
    session?.user &&
    !(
      session?.user?.role === "admin" || session?.user?.role === "general_admin"
    )
  ) {
    console.log("User NO autorizado");
    return false;
  }

  console.log("User autorizado");
  return true;
});

export const getLoggedInUser = cache(
  async (
    email: string,
    password: string
  ): Promise<
    [user: UserType, accessToken: string, refreshToken: string] | undefined
  > => {
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

      const setCookieHeader = response.headers.get("Set-Cookie"); // Puede ser null si no hay cookies
      function getCookieFromHeader(
        header: string | null,
        name: string
      ): string {
        if (!header) return "";
        const match = header.match(new RegExp(`${name}=([^;]+)`));
        return match ? match[1] : "";
      }

      const accessToken = getCookieFromHeader(setCookieHeader, "access_token");
      const refreshToken = getCookieFromHeader(
        setCookieHeader,
        "refresh_token"
      );
      console.log(accessToken, refreshToken);

      const result = await response.json();
      return [result.data, accessToken, refreshToken];
    } catch (error) {
      console.log("Failed to fetch user:", error);
      return;
    }
  }
);
