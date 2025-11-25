import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/dal";
import MainContainer from "@/app/ui/home/main-container";
import Header from "@/app/ui/home/header";

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={session.user} />
      <MainContainer user={session.user} />
    </div>
  );
}
