import clsx from "clsx";

export default function StepContent({
  children,
  isStepContentVisible,
}: {
  children?: React.ReactNode;
  isStepContentVisible?: boolean;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-slate-100 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.55)] bg-white p-4 transition-all duration-300 ease-out sm:p-5",
        {
          "translate-y-0 opacity-100": isStepContentVisible,
          "translate-y-2 opacity-0": !isStepContentVisible,
        },
      )}
    >
      {children}
    </div>
  );
}
