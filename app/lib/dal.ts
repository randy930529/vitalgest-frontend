import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SessionPayload, SessionType, UserType } from "@/app/lib/definitions";
import { decrypt, updateSession } from "@/app/lib/session";

export const customErrorCodes = {
  NO_TOKEN_PROVIDED: "",
  INVALID_TOKEN: "",
};

export const verifySession = cache(async (): Promise<SessionType> => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (
    !session ||
    !session.user ||
    !session.accessToken ||
    !session.refreshToken
  ) {
    redirect("/login");
  }

  const upError = await updateSession(session as SessionPayload);

  if (upError) {
    redirect("/login");
  }

  const { user, accessToken, refreshToken } = session as SessionPayload;

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

      const result = await response.json();
      return [result.data, accessToken, refreshToken];
    } catch (error) {
      console.log("Failed to fetch user:", error);
      return;
    }
  }
);

export async function refreshAccessToken(
  token: string
): Promise<{ accessToken: string; refreshToken: string } | string | undefined> {
  const endPoint = `${process.env.API_URL}/api/auth/refresh/token`;

  try {
    const response = await fetch(endPoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const result = await response.json();
      console.log(result);

      if (!result?.success) return result.error;
      return;
    }

    const result = await response.json();
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return;
  }
}
