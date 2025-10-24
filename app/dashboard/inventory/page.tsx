import InventoryTable from "@/app/ui/dashboard/inventory/inventory-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Inventario",
};

export default async function InventoryPage() {
  return (
    <>
      <div>(Página) Listado de insumos - [SSR]</div>
      <InventoryTable />
    </>
  );
}
