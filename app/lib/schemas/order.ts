import { z } from "zod";

const FormOrderSchema = z.object({
  itemId: z
    .string()
    .uuid({ message: "Por favor seleccione un pedido válido." }),
  addedQuantity: z
    .number()
    .min(1, { message: "La cantidad debe ser un número positivo." }),
});

export const UpdateOrder = FormOrderSchema.omit({});
