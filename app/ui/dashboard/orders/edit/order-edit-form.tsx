"use client";

import { FormFieldType } from "@/app/lib/definitions";
import { updateOrder } from "@/app/lib/actions/order";
import { OrderState } from "@/app/lib/config/stateConfigs";
import { GenericForm } from "@/app/ui/components/generic-form";

type OrderEditFormProps = {
  orderId: string;
  itemId: string;
  reported?: number;
  um?: string;
  added?: number;
  nameSupply?: string;
  onClose?: () => void;
};

export default function OrderEditForm({
  orderId,
  itemId,
  reported,
  um,
  added,
  nameSupply,
  onClose,
}: OrderEditFormProps) {
  // (Component) Formulario de Pedido - [CSR]

  const fields: FormFieldType[] = [
    {
      title: "Cantidad",
      name: "addedQuantity",
      type: "number",
      defaultValue: !!added ? added?.toString() : "1",
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
        <h3 className="font-semibold text-slate-700">{nameSupply}</h3>
        <dt className="inline text-slate-700">Cantidad reportada:</dt>
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
