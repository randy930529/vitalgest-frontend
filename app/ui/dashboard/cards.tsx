export type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
};

type DashboardCardShellProps = StatCardProps & {
  wrapperClassName: string;
  titleClassName: string;
  valueClassName: string;
  titleTag?: "p" | "h2";
};

function DashboardCardShell({
  title,
  value,
  icon: Icon,
  color,
  wrapperClassName,
  titleClassName,
  valueClassName,
  titleTag = "p",
}: DashboardCardShellProps) {
  const TitleTag = titleTag;

  return (
    <div className={wrapperClassName}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <TitleTag className={titleClassName}>{title}</TitleTag>
          <p className={valueClassName}>{value}</p>
        </div>
        <div
          className={`${color} rounded-2xl p-3.5 shadow-[0_20px_35px_-20px_rgba(15,23,42,0.6)]`}
        >
          <Icon className="w-8 h-8 text-white" />
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
      wrapperClassName="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-[0_35px_65px_-45px_rgba(15,23,42,0.5)]"
      titleClassName="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
      valueClassName="mt-2 text-xl font-semibold text-slate-900"
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
      wrapperClassName="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-[0_35px_65px_-45px_rgba(15,23,42,0.5)]"
      titleClassName="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
      valueClassName="mt-2 text-xs font-semibold text-slate-800"
    />
  );
}
