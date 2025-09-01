import DelegationForm from "@/app/ui/dashboard/delegations/delegation-form";
import DelegationList from "@/app/ui/dashboard/delegations/delegation-list";

export default async function Page() {
  return (
    <>
      <div>(Página) Gestionar delegaciones - [SSR]</div>
      <DelegationList />
      <DelegationForm />
    </>
  );
}
