import InventoryEntryForm from "@/app/ui/dashboard/inventory/entry/Inventory-entry-form";

export default async function Page() {
  return (
    <>
      <div>(Página) Registrar entrada de insumos - [SSR]</div>
      <InventoryEntryForm />
    </>
  );
}
