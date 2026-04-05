import type {
  AmbulanceType,
  DelegationType,
  GuardType,
} from "@/app/lib/definitions";

export type DashboardRange = "today" | "week" | "month";

export const DASHBOARD_RANGES: DashboardRange[] = ["today", "week", "month"];

export const DASHBOARD_RANGE_OPTIONS: Array<{
  key: DashboardRange;
  label: string;
}> = [
  { key: "today", label: "Hoy" },
  { key: "week", label: "7 dias" },
  { key: "month", label: "30 dias" },
];

export type TrendPoint = {
  slot: string;
  cobertura: number;
};

export type DelegationSeriesPoint = Record<string, number | string>;

type RangeConfig = {
  totalWindowMs: number;
  buckets: number;
  labelFormatter: (bucketEnd: Date, index: number) => string;
};

const RANGE_CONFIG: Record<DashboardRange, RangeConfig> = {
  today: {
    totalWindowMs: 6 * 60 * 60 * 1000,
    buckets: 6,
    labelFormatter: (bucketEnd: Date, index: number) => {
      if (index === 5) return "Ahora";
      return `${String(bucketEnd.getHours()).padStart(2, "0")}:00`;
    },
  },
  week: {
    totalWindowMs: 7 * 24 * 60 * 60 * 1000,
    buckets: 7,
    labelFormatter: (bucketEnd: Date) => {
      const shortDay = bucketEnd
        .toLocaleDateString("es-MX", { weekday: "short" })
        .replace(".", "");
      return shortDay.charAt(0).toUpperCase() + shortDay.slice(1);
    },
  },
  month: {
    totalWindowMs: 30 * 24 * 60 * 60 * 1000,
    buckets: 6,
    labelFormatter: (bucketEnd: Date) =>
      bucketEnd
        .toLocaleDateString("es-MX", { day: "2-digit", month: "short" })
        .replace(".", ""),
  },
};

const resolveGuardTimestamp = (guard: GuardType): Date | null => {
  const rawDate = guard.created_at || guard.createdAt || guard.date;
  const parsedDate = new Date(rawDate);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

export const buildTrendSeries = ({
  guards,
  ambulances,
  totalWindowMs,
  buckets,
  labelFormatter,
}: {
  guards: GuardType[];
  ambulances: AmbulanceType[];
  totalWindowMs: number;
  buckets: number;
  labelFormatter: (bucketEnd: Date, index: number) => string;
}): TrendPoint[] => {
  const operationalGuards = guards.filter(({ state }) => state !== "Cerrada");
  const now = Date.now();
  const bucketMs = totalWindowMs / buckets;
  const totalAmbulances = ambulances.length;

  return Array.from({ length: buckets }, (_, index) => {
    const bucketStartMs = now - totalWindowMs + index * bucketMs;
    const bucketEndMs = bucketStartMs + bucketMs;

    const guardsInBucket = operationalGuards.filter((guard) => {
      const timestamp = resolveGuardTimestamp(guard);
      if (!timestamp) return false;
      const ts = timestamp.getTime();
      return ts >= bucketStartMs && ts < bucketEndMs;
    }).length;

    const coverage = totalAmbulances
      ? Math.round((guardsInBucket / totalAmbulances) * 100)
      : 0;

    return {
      slot: labelFormatter(new Date(bucketEndMs), index),
      cobertura: clampPercent(coverage),
    };
  });
};

export const buildDelegationSeries = ({
  guards,
  ambulances,
  delegations,
  totalWindowMs,
  buckets,
  slotFormatter,
}: {
  guards: GuardType[];
  ambulances: AmbulanceType[];
  delegations: DelegationType[];
  totalWindowMs: number;
  buckets: number;
  slotFormatter: (bucketEnd: Date, index: number) => string;
}): DelegationSeriesPoint[] => {
  const operationalGuards = guards.filter(({ state }) => state !== "Cerrada");
  const now = Date.now();
  const bucketMs = totalWindowMs / buckets;

  return Array.from({ length: buckets }, (_, bucketIndex) => {
    const bucketStartMs = now - totalWindowMs + bucketIndex * bucketMs;
    const bucketEndMs = bucketStartMs + bucketMs;

    const bucketData: DelegationSeriesPoint = {
      slot: slotFormatter(new Date(bucketEndMs), bucketIndex),
    };

    delegations.forEach((delegation) => {
      const delegationAmbulances = ambulances.filter(
        (ambulance) => ambulance.delegation?.id === delegation.id,
      );

      if (!delegationAmbulances.length) return;

      const activeInBucket = delegationAmbulances.filter((ambulance) => {
        return operationalGuards.some((guard) => {
          if (!guard.shifts?.length) return false;

          const hasShiftForAmbulance = guard.shifts.some(
            (shift) => shift.ambulance?.id === ambulance.id,
          );

          if (!hasShiftForAmbulance) return false;

          const timestamp = resolveGuardTimestamp(guard);
          if (!timestamp) return false;

          const ts = timestamp.getTime();
          return ts >= bucketStartMs && ts < bucketEndMs;
        });
      }).length;

      const coverage = delegationAmbulances.length
        ? Math.round((activeInBucket / delegationAmbulances.length) * 100)
        : 0;

      bucketData[delegation.name] = coverage;
    });

    return bucketData;
  });
};

export const buildChartDataForRange = ({
  range,
  guards,
  ambulances,
  delegations,
}: {
  range: DashboardRange;
  guards: GuardType[];
  ambulances: AmbulanceType[];
  delegations: DelegationType[];
}) => {
  const cfg = RANGE_CONFIG[range];

  return {
    trendData: buildTrendSeries({
      guards,
      ambulances,
      totalWindowMs: cfg.totalWindowMs,
      buckets: cfg.buckets,
      labelFormatter: cfg.labelFormatter,
    }),
    delegationData: buildDelegationSeries({
      guards,
      ambulances,
      delegations,
      totalWindowMs: cfg.totalWindowMs,
      buckets: cfg.buckets,
      slotFormatter: cfg.labelFormatter,
    }),
  };
};

export const buildChartDataByRange = ({
  guards,
  ambulances,
  delegations,
}: {
  guards: GuardType[];
  ambulances: AmbulanceType[];
  delegations: DelegationType[];
}) => {
  const trendDataByRange = {
    today: [] as TrendPoint[],
    week: [] as TrendPoint[],
    month: [] as TrendPoint[],
  };

  const delegationDataByRange = {
    today: [] as DelegationSeriesPoint[],
    week: [] as DelegationSeriesPoint[],
    month: [] as DelegationSeriesPoint[],
  };

  DASHBOARD_RANGES.forEach((range) => {
    const { trendData, delegationData } = buildChartDataForRange({
      range,
      guards,
      ambulances,
      delegations,
    });

    trendDataByRange[range] = trendData;
    delegationDataByRange[range] = delegationData;
  });

  return { trendDataByRange, delegationDataByRange };
};
