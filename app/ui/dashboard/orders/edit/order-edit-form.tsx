"use client";

import { FormFieldType } from "@/app/lib/definitions";
import { updateOrder } from "@/app/lib/actions/order";
import { OrderState } from "@/app/lib/config/stateConfigs";
import { GenericForm } from "@/app/ui/components/generic-form";

export default function OrderEditForm({
  orderId,
  itemId,
  reported,
  um,
  onClose,
}: {
  orderId: string;
  itemId: string;
  reported?: number;
  um?: string;
  onClose?: () => void;
}) {
  // (Component) Formulario de Pedido - [CSR]

  const fields: FormFieldType[] = [
    {
      title: "Cantidad de insumos a agregar",
      name: "addedQuantity",
      type: "number",
      defaultValue: "1",
      required: true,
    },
  ];

  function handleSubmit(prevState: OrderState, formData: FormData) {
    formData.append("itemId", itemId);
    return updateOrder(orderId, formData, prevState);
  }

  return (
    <>
      <div className="mb-4 text-sm text-slate-700">
        <dt className="inline text-slate-700">
          Cantidad de insumos reportados:
        </dt>
        <dd className="inline font-semibold text-rose-500">{` ${reported ?? 0} ${um ?? ""}`}</dd>
      </div>
      <GenericForm
        fields={fields}
        onSubmit={handleSubmit}
        initialState={{ errors: {}, message: null }}
        onCancel={onClose}
      />
    </>
  );
}
