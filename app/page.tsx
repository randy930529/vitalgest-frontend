import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/dal";
import MainContainer from "@/app/ui/home/main-container";
import Header from "@/app/ui/home/header";
import TopMenuBar from "@/app/ui/home/top-menu-bar";

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.85),_rgba(241,245,249,1))]">
      <a
        href="#home-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[140] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900"
      >
        Saltar al contenido principal
      </a>
      <TopMenuBar user={session.user} />
      <Header user={session.user} />
      <MainContainer user={session.user} />
    </div>
  );
}
