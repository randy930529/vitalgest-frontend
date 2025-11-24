import clsx from "clsx";

export function Badge({
  title,
  success,
  pending,
}: {
  title: string;
  success?: boolean;
  pending?: boolean;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center border text-xs font-medium px-1.5 py-0.5 rounded-lg",
        {
          "bg-slate-100 border-green-300 text-green-700": success && !pending,
          "bg-slate-100 border-slate-300 text-gray-700": !success && !pending,
          "bg-orange-100 border-orange-300 text-orange-700":
            !success && pending,
        }
      )}
    >
      <span
        className={clsx("w-2 h-2 me-1 rounded-full", {
          "bg-green-600": success && !pending,
          "bg-slate-600": !success && !pending,
          "bg-orange-600": !success && pending,
        })}
      ></span>
      {title}
    </span>
  );
}
