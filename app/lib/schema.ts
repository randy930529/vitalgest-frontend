import { File } from "buffer";
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
  state: z.string({
    invalid_type_error: "Por favor seleccione un estado.",
  }),
  municipality: z.string({
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
    invalid_type_error: "Por favor seleccione un paramédico.",
  }),
  driverId: z.string({
    invalid_type_error: "Por favor seleccione un chofer.",
  }),
});

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const FormChecklistSchema = z.object({
  id: z.string().uuid(),
  ambulanceId: z
    .string({
      invalid_type_error: "Por favor seleccione una ambulancia.",
    })
    .uuid({ message: "Identificador de ambulancia inválido." }),
  shiftId: z
    .string({
      invalid_type_error: "Por favor seleccione un turno de guardia.",
    })
    .uuid({ message: "Identificador de turno inválido." }),
  km: z
    .number({
      invalid_type_error: "Por favor ingrese kilometraje actual.",
    })
    .min(0, { message: "El kilometraje no puede ser negativo." }),
  notes: z
    .string()
    .trim()
    .max(1000, { message: "Las notas no deben exceder los 1000 caracteres." })
    .optional()
    .nullable(),
  gasFile: z
    .instanceof(File, { message: "Por favor adjunte el vale de combustible." })
    .refine(
      (file: File) => !file || file.size <= MAX_FILE_SIZE,
      "El archivo de combustible excede el tamaño máximo de 3 MB."
    )
    .refine(
      (file: File) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Formato no válido. Solo se permiten JPG, PNG o PDF."
    ),
  signOperatorFile: z
    .instanceof(File, { message: "Por favor adjunte la firma del operador." })
    .refine(
      (file: File) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Formato no válido. Solo se permiten JPG, PNG o PDF."
    )
    .refine(
      (file: File) => !file || file.size <= MAX_FILE_SIZE,
      "La firma del operador excede el tamaño máximo de 5 MB."
    ),
  signRecipientFile: z
    .instanceof(File, { message: "Por favor adjunte la firma del receptor." })
    .refine((file: File) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Formato no válido. Solo se permiten JPG, PNG o PDF.",
    })
    .refine(
      (file: File) => !file || file.size <= MAX_FILE_SIZE,
      "La firma del receptor excede el tamaño máximo de 5 MB."
    ),
});

export const CreateUser = FormUserSchema.omit({ id: true, status: true });
export const UpdateUser = FormUserSchema.omit({ id: true, password: true });

export const CreateDelegation = FormDelegationSchema.omit({ name: true });
export const UpdateDelegation = FormDelegationSchema.omit({});

export const CreateGuard = FormGuardSchema.omit({ id: true });
export const UpdateGuard = FormGuardSchema.omit({ id: true });

export const CreateAmbulance = FormAmbulanceSchema.omit({ id: true });
export const UpdateAmbulance = FormAmbulanceSchema.omit({ id: true });

export const CreateShift = FormShiftSchema.omit({ id: true });
export const UpdateShift = FormShiftSchema.omit({ id: true });

export const CreateChecklist = FormChecklistSchema.omit({
  id: true,
  signOperatorFile: true,
  signRecipientFile: true,
});
export const UpdateChecklist = FormChecklistSchema.omit({
  id: true,
  gasFile: true,
});
