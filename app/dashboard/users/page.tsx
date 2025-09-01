import UserTable from "@/app/ui/dashboard/users/user-table";

export default async function Page() {
  return (
    <>
      <div>(Página) Listado de usuarios - [SSR]</div>
      <UserTable />
    </>
  );
}
