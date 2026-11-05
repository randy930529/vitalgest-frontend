import type { NextAuthConfig } from "next-auth";
import { ROLE_MANAGER } from "@/app/lib/config/constants";

export const publicRoutes = ["/login", "/signup"] as const;

export function isPublicRoute(pathname: string) {
  return publicRoutes.includes(pathname as (typeof publicRoutes)[number]);
}

export function isDashboardRoute(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

export function getPostLoginRedirect(
  role: string | null | undefined,
  callbackUrl?: string | null,
) {
  const isAdmin = ROLE_MANAGER.isAdmin(role);
  const candidate = callbackUrl?.trim();

  if (candidate && candidate.startsWith("/") && !candidate.startsWith("//")) {
    const callbackPath = new URL(candidate, "http://localhost").pathname;

    if (
      !isPublicRoute(callbackPath) &&
      (!isDashboardRoute(callbackPath) || isAdmin)
    ) {
      return candidate;
    }
  }

  return isAdmin ? "/dashboard" : "/";
}

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      return isPublicRoute(nextUrl.pathname) || !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
