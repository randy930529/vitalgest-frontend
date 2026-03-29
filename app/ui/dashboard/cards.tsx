export type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
};

export function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-[0_35px_65px_-45px_rgba(15,23,42,0.5)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
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

export function StatCardHome({
  title,
  value,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-[0_35px_65px_-45px_rgba(15,23,42,0.5)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {title}
          </h2>
          <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
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

export function CardAmbulancesGuard({
  title,
  value,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-[0_35px_65px_-45px_rgba(15,23,42,0.5)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {title}
          </h2>
          <p className="mt-2 text-xs font-semibold text-slate-800">{value}</p>
        </div>
        <div
          className={`${color} rounded-2xl p-3.5 text-white shadow-[0_20px_35px_-20px_rgba(15,23,42,0.6)]`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
}
