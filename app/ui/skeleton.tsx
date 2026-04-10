import clsx from "clsx";

export const skeletonShimmerClass =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function SkeletonPanel({
  children,
  className,
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <section
      aria-label={ariaLabel}
      className={clsx(
        "relative overflow-hidden rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)]",
        className,
      )}
    >
      <div className="animate-pulse space-y-4">{children}</div>
    </section>
  );
}

export function SkeletonLine({ className }: { className?: string }) {
  return <div className={clsx("rounded bg-slate-200", className)} />;
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={clsx("rounded-2xl bg-slate-200/80", className)} />;
}
