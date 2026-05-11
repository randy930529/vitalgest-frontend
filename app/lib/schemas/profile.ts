import { File } from "buffer";
import { z } from "zod";
import { FILE_UPLOAD } from "@/app/lib/config/constants";

const FormProfileSchema = z.object({
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
  // email: z
  //   .string()
  //   .email({ message: "Por favor ingrese un correo electrónico válido." })
  //   .trim(),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => !value || /^[0-9+()\-\s]{7,20}$/.test(value),
      "Por favor ingrese un teléfono válido.",
    )
    .optional(),
  avatarFile: z
    .instanceof(File, { message: "Por favor adjunte la imagen de perfil." })
    .refine((file: File) => FILE_UPLOAD.typeOfFile(file.type), {
      message: "Formato no válido. Solo se permiten JPG o PNG.",
    })
    .refine(
      (file: File) => !file || file.size <= FILE_UPLOAD.MAX_FILE_SIZE,
      `La imagen de perfil excede el tamaño máximo de ${FILE_UPLOAD.MAX_FILE_SIZE} MB.`,
    ),
  signatureFile: z
    .instanceof(File, { message: "Por favor adjunte la firma." })
    .refine((file: File) => FILE_UPLOAD.typeOfFile(file.type), {
      message: "Formato no válido. Solo se permiten JPG o PNG.",
    })
    .refine(
      (file: File) => !file || file.size <= FILE_UPLOAD.MAX_FILE_SIZE,
      `La firma excede el tamaño máximo de ${FILE_UPLOAD.MAX_FILE_SIZE} MB.`,
    ),
  password: z
    .string()
    .trim()
    .refine(
      (value) =>
        !value ||
        (value.length >= 8 &&
          /[a-zA-Z]/.test(value) &&
          /[0-9]/.test(value) &&
          /[@$!%#?&]/.test(value)),
      {
        message:
          "La contraseña debe tener al menos 8 caracteres, un número y un carácter especial.",
      },
    )
    .optional(),
  newPassword: z
    .string()
    .trim()
    .refine(
      (value) =>
        !value ||
        (value.length >= 8 &&
          /[a-zA-Z]/.test(value) &&
          /[0-9]/.test(value) &&
          /[@$!%#?&]/.test(value)),
      {
        message:
          "La contraseña debe tener al menos 8 caracteres, un número y un carácter especial.",
      },
    )
    .optional(),
});

const FormSignatureSchema = z.object({
  mime: z.string({
    message: "El tipo MIME es requerido y debe ser una cadena.",
  }),
  ext: z.string({
    message: "La extensión es requerida y debe ser una cadena.",
  }),
  size: z.number({
    message: "El tamaño es requerido y debe ser un número.",
  }),
  key: z.string({
    message: "La clave es requerida y debe ser una cadena.",
  }),
});

export const UpdateProfile = FormProfileSchema.omit({
  password: true,
  newPassword: true,
  avatarFile: true,
  signatureFile: true,
});
export const UpdatePassword = FormProfileSchema.omit({
  name: true,
  lastname: true,
  phone: true,
  avatarFile: true,
  signatureFile: true,
});
export const UpdateSignature = FormSignatureSchema.omit({
  mime: true,
  ext: true,
  size: true,
});
export const UploadSignature = FormSignatureSchema.omit({ key: true });
