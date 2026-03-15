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
