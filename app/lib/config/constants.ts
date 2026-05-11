import { CustomOptions } from "@/app/lib/definitions";

export const ERROR_MESSAGES = {
  errorCodeList: {
    INVALID_CREDENTIALS: "Credenciales inválidas.",
    USER_NOT_FOUND: "Usuario no encontrado.",
    TOKEN_EXPIRED: "Token expirado.",
    INVALID_TOKEN: "Token inválido.",
    USER_INACTIVE: "Usuario inactivo.",
    PERMISSION_DENIED: "Permiso denegado.",
    UNKNOWN_ERROR: "Error desconocido.",
    INSERT_FAILED: "No se pudo guardar.",
    UPDATE_FAILED: "No se pudo actualizar.",
    DELETE_FAILED: "No se pudo eliminar.",
    EMAIL_ALREADY_REGISTERED: "El correo ya está registrado.",
    CREDENTIALS_NOT_MATCH: "Datos incorrectos.",
    TOO_MANY_REQUESTS: "Demasiados intentos.",
    MISSING_USER_ID: "Falta el ID de usuario.",
    MISSING_NAME: "Falta el nombre.",
    MISSING_LASTNAME: "Falta el apellido.",
    MISSING_EMAIL: "Falta el correo.",
    MISSING_PASSWORD: "Falta la contraseña.",
    MISSING_ROLE: "Falta el rol.",
    MISSING_STATUS: "Falta el estado del usuario.",
    MISSING_POSITION: "Falta el cargo.",
    MISSING_AMOUNT: "Falta el monto.",
    INVALID_EMAIL_FORMAT: "Correo inválido.",
    INVALID_PASSWORD_FORMAT: "Contraseña inválida.",
    INVALID_ROLE: "Rol inválido.",
    INVALID_USER_ID: "ID de usuario inválido.",
    AMOUNT_NOT_NUMBER: "El monto debe ser un número.",
    TOKENS_NOT_GENERATED: "No se generaron los tokens.",
    NO_TOKEN_PROVIDED: "Falta el token.",
    INVALID_TOKEN_USER: "Token no válido para este usuario.",
    INVALID_BEARER_TOKEN: "Token de acceso inválido.",
    VALIDATE_TOKEN_ERROR: "No se pudo validar el token.",
    UNAUTHORIZED_RANK: "No tienes permisos.",
    USER_NOT_ACTIVE: "Usuario inactivo.",

    // * errores de las delegaciones
    MISSING_STATE_ID: "Falta el ID del estado.",
    INVALID_STATE_ID: "ID del estado inválido.",
    STATE_NOT_FOUND: "Estado no encontrado.",
    STATES_NOT_FOUND: "No se encontraron estados.",
    MUNICIPALITIES_NOT_FOUND: "No se encontraron municipios.",

    MISSING_DELEGATION_ID: "Falta el ID de la delegación.",
    MISSING_DELEGATION_NAME: "Falta el nombre de la delegación.",
    MISSING_MUNICIPALITY: "Falta el municipio.",
    MISSING_STATE: "Falta el estado.",
    MISSING_PHARMACY: "Falta la farmacia.",
    MISSING_STATE_NAME: "Falta el nombre del estado.",
    MISSING_MUNICIPALITY_NAME: "Falta el nombre del municipio.",

    INVALID_DELEGATION_ID: "ID de delegación inválido.",
    INVALID_DELEGATION_NAME: "Nombre de delegación inválido.",
    INVALID_MUNICIPALITY: "Municipio inválido.",
    INVALID_STATE: "Estado inválido.",
    INVALID_PHARMACY: "Farmacia inválida.",

    DELEGATION_NOT_FOUND: "Delegación no encontrada.",

    // * errores de las guardias
    MISSING_GUARD_ID: "Falta el ID de guardia.",
    MISSING_GUARD_CHIEF: "Falta el jefe de guardia.",
    MISSING_DATE: "Falta la fecha.",

    INVALID_GUARD_ID: "ID de guardia inválido.",
    INVALID_GUARD_CHIEF: "Jefe de guardia inválido.",
    INVALID_DATE: "Fecha inválida.",

    USER_NOT_GUARD_CHIEF: "No eres jefe de guardia.",
    DATE_EXPIRED: "La fecha ya expiró.",
    GUARD_ALREADY_EXISTS: "La guardia ya existe.",
  },
  get(code: string): string {
    return (
      this.errorCodeList[code as keyof typeof this.errorCodeList] ||
      this.errorCodeList.UNKNOWN_ERROR
    );
  },
} as const;

export const ROLE_MANAGER = {
  roleCatalog: [
    { id: 0, value: "", label: "Seleccione un rol" },
    { id: 1, value: "general_admin", label: "Administrador General" },
    { id: 2, value: "admin", label: "Administrador" },
    { id: 3, value: "head_guard", label: "Jefe de Guardia" },
    { id: 4, value: "vehicle_operator", label: "Operador de Ambulancia" },
    { id: 5, value: "paramedical", label: "Paramédico" },
  ],

  adminRoles() {
    return new Set<(typeof this.roleCatalog)[number]["value"]>([
      "general_admin",
      "admin",
    ]);
  },

  roleLabels() {
    return this.roleCatalog.reduce(
      (acc, role) => {
        acc[role.value] = role.label;
        return acc;
      },
      {} as Record<string, string>,
    );
  },

  getLabel(role?: string | null): string {
    const normalized = (role || "").trim();
    if (!normalized) return "Sin rol";

    return this.roleLabels()[normalized] || normalized;
  },

  getOptionByValue(role?: string | null): CustomOptions | undefined {
    const normalized = (role || "").trim();
    if (!normalized) return undefined;

    return this.roleCatalog.find((option) => option.value === normalized);
  },

  isAdmin(role?: string | null): boolean {
    const normalized = (
      role || ""
    ).trim() as (typeof this.roleCatalog)[number]["value"];
    return this.adminRoles().has(normalized);
  },

  selectOptions() {
    return this.roleCatalog;
  },
} as const;

export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 3 * 1024 * 1024, // 3 MB
  ACCEPTED_FILE_TYPES: ["image/jpeg", "image/png", "application/pdf"],
  typeOfFile(typeFile: string): boolean {
    return this.ACCEPTED_FILE_TYPES.includes(
      typeFile as (typeof this.ACCEPTED_FILE_TYPES)[number],
    );
  },
} as const;
