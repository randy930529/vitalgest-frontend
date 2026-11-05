import { NextRequest, NextResponse } from "next/server";
import { isDashboardRoute, isPublicRoute } from "@/auth.config";
import { deleteSession, updateSession } from "@/app/lib/session";
import { getSession } from "@/app/lib/dal";
import { ROLE_MANAGER } from "@/app/lib/config/constants";

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png|images/.*\\.svg$).*)"],
  runtime: "nodejs",
};

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  const session = await getSession();
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", `${path}${req.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  const updateError = await updateSession(session);
  if (updateError) {
    console.log(updateError);
    await deleteSession();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isDashboardRoute(path) && !ROLE_MANAGER.isAdmin(session.user.role)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
