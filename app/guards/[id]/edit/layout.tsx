import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/dal";
import Header from "@/app/ui/home/header";

export default async function HomeGuardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={session.user} />
      {children}
    </div>
  );
}
