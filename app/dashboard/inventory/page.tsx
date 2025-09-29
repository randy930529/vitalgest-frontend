import InventoryTable from "@/app/ui/dashboard/inventory/inventory-table";

export default async function Page() {
  return (
    <>
      <div>(Página) Listado de insumos - [SSR]</div>
      <InventoryTable />
    </>
  );
}
