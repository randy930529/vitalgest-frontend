import { z } from "zod";

const FormUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string({
    invalid_type_error: "Please enter an user name.",
  }),
  lastname: z.string({
    invalid_type_error: "Please enter an user last name.",
  }),
  email: z
    .string({
      invalid_type_error: "Please enter a valid email address.",
    })
    .email(),
  password: z
    .string({
      invalid_type_error: "Please enter a valid password.",
    })
    .min(6),
  role: z.enum(
    ["admin", "paramedical", "vehicle_operator", "head_guard", "general_admin"],
    {
      invalid_type_error: "Please select an user role.",
    }
  ),
  state: z.boolean({
    invalid_type_error: "Please select an user state.",
  }),
  position: z.string({
    invalid_type_error: "Please enter an user position.",
  }),
});

const FormDelegationSchema = z.object({
  name: z.string({
    invalid_type_error: "Por favor ingrese el nombre de la delegación.",
  }),
  state: z.number({
    invalid_type_error: "Por favor seleccione un estado.",
  }),
  municipality: z.number({
    invalid_type_error: "Por favor seleccione un municipio.",
  }),
});

export const CreateUser = FormUserSchema.omit({ id: true, state: true });
export const UpdateUser = FormUserSchema.omit({ id: true, password: true });

export const UpdateDelegation = FormDelegationSchema.omit({});
