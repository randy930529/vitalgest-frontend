export type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
};

type DashboardCardShellProps = StatCardProps & {
  wrapperClassName: string;
  layoutClassName?: string;
  textContainerClassName?: string;
  titleClassName: string;
  valueClassName: string;
  titleWrapperClassName?: string;
  valueWrapperClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
  titleTag?: "p" | "h2";
};

function DashboardCardShell({
  title,
  value,
  icon: Icon,
  color,
  wrapperClassName,
  layoutClassName = "flex items-center justify-between gap-4",
  textContainerClassName = "min-w-0",
  titleClassName,
  valueClassName,
  titleWrapperClassName = "",
  valueWrapperClassName = "",
  iconContainerClassName = "rounded-2xl p-3.5 shadow-[0_20px_35px_-20px_rgba(15,23,42,0.6)]",
  iconClassName = "w-8 h-8 text-white",
  titleTag = "p",
}: DashboardCardShellProps) {
  const TitleTag = titleTag;

  return (
    <div className={wrapperClassName}>
      <div className={layoutClassName}>
        <div className={textContainerClassName}>
          <TitleTag
            className={`${titleClassName} ${titleWrapperClassName} truncate`}
          >
            {title}
          </TitleTag>
          <p className={`${valueClassName} ${valueWrapperClassName} truncate`}>
            {value}
          </p>
        </div>
        <div className={`${color} ${iconContainerClassName} shrink-0`}>
          <Icon className={iconClassName} />
        </div>
      </div>
    </div>
  );
}

export function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <DashboardCardShell
      title={title}
      value={value}
      icon={Icon}
      color={color}
      wrapperClassName="min-h-28 rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-[0_35px_65px_-45px_rgba(15,23,42,0.5)]"
      titleClassName="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900"
      valueClassName="mt-2 text-3xl font-semibold text-slate-600"
    />
  );
}

export function StatCardHome({
  title,
  value,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <DashboardCardShell
      title={title}
      value={value}
      icon={Icon}
      color={color}
      titleTag="h2"
      wrapperClassName="min-h-28 rounded-[24px] border border-white/80 bg-white/90 p-3 sm:p-4 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-[0_35px_65px_-45px_rgba(15,23,42,0.5)]"
      layoutClassName="flex items-center justify-between gap-3"
      textContainerClassName="min-w-0"
      titleWrapperClassName="hidden sm:block"
      valueWrapperClassName="text-base sm:text-lg"
      titleClassName="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500"
      valueClassName="mt-0 sm:mt-1 font-semibold leading-tight text-slate-900"
      iconContainerClassName="rounded-2xl p-3.5 shadow-[0_20px_35px_-20px_rgba(15,23,42,0.6)]"
      iconClassName="h-8 w-8 text-white"
    />
  );
}

export function CardAmbulancesGuard({
  title,
  value,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <DashboardCardShell
      title={title}
      value={value}
      icon={Icon}
      color={color}
      titleTag="h2"
      wrapperClassName="min-h-28 rounded-[24px] border border-white/80 bg-white/90 p-3 sm:p-4 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-[0_35px_65px_-45px_rgba(15,23,42,0.5)]"
      layoutClassName="flex items-center justify-between gap-3"
      textContainerClassName="min-w-0"
      titleWrapperClassName="hidden sm:block"
      valueWrapperClassName="text-xs sm:text-sm"
      titleClassName="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500"
      valueClassName="mt-0 sm:mt-1 font-semibold leading-tight text-slate-800"
      iconContainerClassName="rounded-2xl p-3.5 shadow-[0_20px_35px_-20px_rgba(15,23,42,0.6)]"
      iconClassName="h-8 w-8 text-white"
    />
  );
}
