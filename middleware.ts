import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { deleteSession, updateSession } from "@/app/lib/session";
import { getSession } from "@/app/lib/dal";

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png|images/.*\\.svg$).*)"],
  runtime: "nodejs",
};

const publicRoutes = ["/login", "/signup"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  if (!isPublicRoute) {
    const session = await getSession();
    const upError = session && (await updateSession(session));

    if (upError) {
      console.log(upError);
      await deleteSession();
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }
  return NextResponse.next();
}
