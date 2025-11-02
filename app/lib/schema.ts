import { z } from "zod";

const FormUserSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string({
      invalid_type_error: "Por favor ingrese el nombre del usuario.",
    })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .trim(),
  lastname: z
    .string({
      required_error: "Por favor ingrese los apellidos del usuario.",
    })
    .min(2, { message: "El apellido debe tener al menos 2 caracteres." })
    .max(50, { message: "El apellido no debe exceder los 50 caracteres." })
    .regex(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]+$/, {
      message:
        "El apellido solo puede contener letras, espacios, guiones o apóstrofes",
    })
    .trim(),
  email: z
    .string()
    .email({ message: "Por favor ingrese un correo electrónico válido." })
    .trim(),
  password: z
    .string({
      required_error: "La contraseña es obligatoria.",
    })
    .min(8, { message: "Debe tener al menos 8 caracteres." })
    .regex(/[a-zA-Z]/, {
      message: "Debe contener al menos una mayúscula y una minúscula.",
    })
    .regex(/[0-9]/, { message: "Debe contener al menos un número." })
    .regex(/[@$!%#?&]/, {
      message: "Debe contener al menos un carácter especial.",
    })
    .trim(),
  role: z.enum(
    ["admin", "paramedical", "vehicle_operator", "head_guard", "general_admin"],
    {
      invalid_type_error: "Por favor seleccione un rol de usuario.",
    }
  ),
  status: z.boolean({
    invalid_type_error: "Por favor seleccione el estado del usuario.",
  }),
  position: z.string({
    invalid_type_error: "Por favor ingrese el cargo del usuario.",
  }),
  delegation: z.string({
    invalid_type_error: "Por favor seleccione una delegación.",
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

const FormGuardSchema = z.object({
  id: z.string().uuid(),
  guardChief: z.string({
    invalid_type_error: "Por favor seleccione el jefe de guardia.",
  }),
  date: z.date({
    invalid_type_error: "Formato de fecha inválido.",
    message: "Por favor seleccione un fecha.",
  }),
  delegationId: z.string({
    invalid_type_error: "Por favor seleccione una delegación.",
  }),
});

const FormAmbulanceSchema = z.object({
  id: z.string().uuid(),
  number: z.string({
    invalid_type_error: "Por favor ingrese el número de la ambulancia.",
  }),
  brand: z.string({
    invalid_type_error: "Por favor ingrese la marca de la ambulancia.",
  }),
  model: z.string({
    invalid_type_error: "Por favor ingrese el modelo de la ambulancia.",
  }),
  delegationId: z.string({
    invalid_type_error: "Por favor seleccione una delegación.",
  }),
});

const FormShiftSchema = z.object({
  id: z.string().uuid(),
  ambulanceId: z.string({
    invalid_type_error: "Por favor seleccione una ambulancia.",
  }),
  guardId: z.string({
    invalid_type_error: "Por favor seleccione una guardia.",
  }),
  paramedicalId: z.string({
    invalid_type_error: "Por favor seleccione un paramedico.",
  }),
  driverId: z.string({
    invalid_type_error: "Por favor seleccione un chofer.",
  }),
});

export const CreateUser = FormUserSchema.omit({ id: true, status: true });
export const UpdateUser = FormUserSchema.omit({ id: true, password: true });

export const UpdateDelegation = FormDelegationSchema.omit({ name: true });

export const CreateGuard = FormGuardSchema.omit({ id: true });
export const UpdateGuard = FormGuardSchema.omit({ id: true });

export const CreateAmbulance = FormAmbulanceSchema.omit({ id: true });
export const UpdateAmbulance = FormAmbulanceSchema.omit({ id: true });

export const CreateShift = FormShiftSchema.omit({ id: true });
export const UpdateShift = FormShiftSchema.omit({ id: true });
