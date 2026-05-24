import clsx from "clsx";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "default";

export function Badge({
  title,
  success,
  pending,
  variant,
  extraClassName,
}: {
  title: string;
  success?: boolean;
  pending?: boolean;
  variant?: BadgeVariant;
  extraClassName?: string;
}) {
  const resolvedVariant: BadgeVariant =
    variant ?? (success ? "success" : pending ? "warning" : "neutral");
  const badgeTone = {
    success: "emerald",
    warning: "orange",
    danger: "rose",
    neutral: "slate",
    default: "sky",
  }[resolvedVariant];

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        `border-${badgeTone}-300 bg-${badgeTone}-50 text-${badgeTone}-700`,
        extraClassName,
      )}
    >
      <span
        className={clsx("me-1 h-2 w-2 rounded-full", `bg-${badgeTone}-600`, {
          "border border-slate-300": resolvedVariant === "neutral",
        })}
      ></span>
      {title}
    </span>
  );
}
