import MainContainer from "@/app/ui/home/main-container";
import Header from "@/app/ui/home/header";

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <MainContainer />
    </div>
  );
}
