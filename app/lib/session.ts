import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SessionPayload, UserType } from "./definitions";
import { refreshAccessToken } from "./dal";

const lifeTime = Number(process.env.SESSION_LIFETIME || 8);
const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${lifeTime}h`)
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify<SessionPayload>(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}

export async function createSession(
  user: UserType,
  accessToken: string,
  refreshToken: string
) {
  // Ej. 7 días × 24 horas × 60 minutos × 60 segundos × 1000 milisegundos
  const expiresAt = new Date(Date.now() + lifeTime * 60 * 60 * 1000);
  const session = await encrypt({ user, accessToken, refreshToken, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession(payload: SessionPayload) {
  if (new Date(payload.expiresAt) > new Date(Date.now() + 5 * 60 * 1000)) {
    return;
  }

  // Refrescar accessToken y refreshToken en el api
  const newTokens = await refreshAccessToken(payload.refreshToken);

  if (!newTokens || typeof newTokens === "string") {
    const errorMessage =
      typeof newTokens === "string"
        ? newTokens
        : "Verifique su conexión a internet y vuelva a intentarlo.";
    return errorMessage;
  }

  const { accessToken, refreshToken } = newTokens;
  const { user } = payload;
  payload.accessToken = accessToken;
  payload.refreshToken = refreshToken;

  await createSession(user, accessToken, refreshToken);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
