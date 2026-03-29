import clsx from "clsx";
import type { ButtonVariant } from "@/app/ui/button-variants";
import { buttonVariants } from "@/app/ui/button-variants";
import { SaveIcon } from "@/app/ui/components/icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  /**
   * Variante del botón
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Clases adicionales para override
   * Se aplican DESPUÉS de la variante base
   */
  additionalClassName?: string;

  /**
   * Mostrar indicador de carga
   */
  isLoading?: boolean;
}

export function Button({
  children,
  className,
  variant = "primary",
  additionalClassName,
  isLoading = false,
  disabled = false,
  ...rest
}: ButtonProps) {
  // Combinar clases: variante + additional + className (último gana para override)
  const finalClassName = clsx(
    buttonVariants[variant],
    additionalClassName,
    className,
    {
      "opacity-50 cursor-not-allowed": isLoading || disabled,
    },
  );

  return (
    <button
      {...rest}
      disabled={isLoading || disabled}
      className={finalClassName}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Cargando...
        </>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * Componente especializado para botones de acción en formularios
 * Reduce boilerplate en formularios repetitivos
 */
interface FormButtonsProps {
  onCancel?: () => void;
  cancelText?: string;
  submitText?: string;
  cancelIcon?: React.ReactNode;
  submitIcon?: React.ReactNode;
  isLoading?: boolean;
  showCancel?: boolean;
}

export function FormButtons({
  onCancel,
  cancelText = "Cancelar",
  submitText = "Guardar",
  cancelIcon,
  submitIcon = <SaveIcon className="h-4 w-4" />,
  isLoading = false,
  showCancel = true,
}: FormButtonsProps) {
  return (
    <div className="flex w-full flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
      {showCancel && (
        <Button
          type="reset"
          variant="formSecondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelIcon ? (
            <span className="mr-2 inline-flex">{cancelIcon}</span>
          ) : null}
          {cancelText}
        </Button>
      )}
      <Button type="submit" variant="formPrimary" isLoading={isLoading}>
        {submitIcon ? <span className="inline-flex">{submitIcon}</span> : null}
        {submitText}
      </Button>
    </div>
  );
}
