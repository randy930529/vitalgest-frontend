import { z } from "zod";

const FormUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string({
    invalid_type_error: "Please enter an user nombre.",
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
});

export const CreateUser = FormUserSchema.omit({ id: true, state: true });
export const UpdateUser = FormUserSchema.omit({ id: true });
