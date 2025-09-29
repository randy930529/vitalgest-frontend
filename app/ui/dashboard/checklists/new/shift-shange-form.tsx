export default async function ShiftChangeForm() {
  return (
    <>
      <div>(Component) Formulario principal - [CSR]</div>
      <AmbulanceChecklist />
      <SuppliesChecklist />
    </>
  );
}

export function AmbulanceChecklist() {
  return <div># Componente para el checklist de ambulancia.</div>;
}

export function SuppliesChecklist() {
  return <div># Componente para el checklist de insumos.</div>;
}
