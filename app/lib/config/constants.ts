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
