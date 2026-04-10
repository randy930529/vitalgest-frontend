import clsx from "clsx";

type BadgeVariant = "success" | "warning" | "danger" | "neutral";

export function Badge({
  title,
  success,
  pending,
  variant,
}: {
  title: string;
  success?: boolean;
  pending?: boolean;
  variant?: BadgeVariant;
}) {
  const resolvedVariant: BadgeVariant =
    variant ?? (success ? "success" : pending ? "warning" : "neutral");

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-medium",
        {
          "border-emerald-300 bg-emerald-50 text-emerald-700":
            resolvedVariant === "success",
          "border-orange-300 bg-orange-50 text-orange-700":
            resolvedVariant === "warning",
          "border-rose-300 bg-rose-50 text-rose-700":
            resolvedVariant === "danger",
          "border-slate-300 bg-slate-100 text-slate-700":
            resolvedVariant === "neutral",
        },
      )}
    >
      <span
        className={clsx("me-1 h-2 w-2 rounded-full", {
          "bg-emerald-600": resolvedVariant === "success",
          "bg-orange-600": resolvedVariant === "warning",
          "bg-rose-600": resolvedVariant === "danger",
          "bg-slate-600": resolvedVariant === "neutral",
        })}
      ></span>
      {title}
    </span>
  );
}
