"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { fetchChartDataByRange } from "@/app/lib/actions/dashboard";
import { DASHBOARD_CHART_COPY } from "@/app/lib/config/dashboard-copy";
import {
  DASHBOARD_RANGE_OPTIONS,
  type DashboardRange,
  type TrendPoint,
} from "@/app/lib/dashboard-analytics";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DELEGATION_COLORS = [
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

type OperationsChartsProps = {
  trendDataByRange: {
    today: TrendPoint[];
    week: TrendPoint[];
    month: TrendPoint[];
  };
  delegationDataByRange: {
    today: Record<string, number | string>[];
    week: Record<string, number | string>[];
    month: Record<string, number | string>[];
  };
  activeGuards: number;
  pendingGuards: number;
  criticalSupplyCount: number;
};

function ChartContainer({
  children,
}: {
  children: (size: { width: number; height: number }) => React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;
      setSize({
        width: Math.max(0, Math.floor(width)),
        height: Math.max(220, Math.floor(height)),
      });
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="h-56 w-full min-w-0">
      {size.width > 0 ? children(size) : <div className="h-full w-full" />}
    </div>
  );
}

export default function OperationsCharts({
  trendDataByRange,
  delegationDataByRange,
  activeGuards,
  pendingGuards,
  criticalSupplyCount,
}: OperationsChartsProps) {
  const [range, setRange] = useState<DashboardRange>("today");
  const [trendData, setTrendData] = useState<TrendPoint[]>(
    trendDataByRange["today"] || [],
  );
  const [delegationData, setDelegationData] = useState<
    Record<string, number | string>[]
  >(delegationDataByRange["today"] || []);
  const [isLoading, setIsLoading] = useTransition();

  useEffect(() => {
    setIsLoading(async () => {
      const result = await fetchChartDataByRange(range);
      if (result.success) {
        setTrendData(result.data.trendData);
        setDelegationData(result.data.delegationData);
      }
    });
  }, [range, setIsLoading]);

  const statusData = [
    {
      name: DASHBOARD_CHART_COPY.statusSeries.active,
      value: activeGuards,
      fill: "#0ea5e9",
    },
    {
      name: DASHBOARD_CHART_COPY.statusSeries.pending,
      value: pendingGuards,
      fill: "#f59e0b",
    },
    {
      name: DASHBOARD_CHART_COPY.statusSeries.critical,
      value: criticalSupplyCount,
      fill: "#f43f5e",
    },
  ];

  const renderRangeButtons = () => (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {DASHBOARD_RANGE_OPTIONS.map((option) => {
        const isActive = option.key === range;
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => setRange(option.key)}
            disabled={isLoading}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition disabled:opacity-50 ${
              isActive
                ? "border-sky-200 bg-sky-500 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-600"
            }`}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );

  // Transformar datos de formato por-tiempo a formato por-delegación
  const delegationChartData = useMemo(() => {
    if (!delegationData.length) return [];

    const delegationMap = new Map<string, number[]>();

    // Extraer claves de delegación (excluyendo "slot")
    const keys = Object.keys(delegationData[0]).filter((k) => k !== "slot");

    // Organizar datos por delegación
    keys.forEach((key) => {
      const values = delegationData.map((row) => Number(row[key] ?? 0));
      delegationMap.set(key, values);
    });

    // Convertir a array con promedio, ordenado descendentemente
    return Array.from(delegationMap.entries())
      .map(([name, values]) => {
        const avg = Math.round(
          values.reduce((sum, val) => sum + val, 0) / values.length,
        );
        return { name, cobertura: avg };
      })
      .sort((a, b) => b.cobertura - a.cobertura)
      .map((item, index) => ({
        ...item,
        fill: DELEGATION_COLORS[index % DELEGATION_COLORS.length],
      }));
  }, [delegationData]);

  return (
    <section className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-3">
      <article className="min-h-[320px] rounded-[24px] border border-white/80 bg-white/90 p-4 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm xl:col-span-2">
        <header className="mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-900">
            {DASHBOARD_CHART_COPY.trendTitle}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {DASHBOARD_CHART_COPY.trendDescription}
          </p>
          {renderRangeButtons()}
        </header>
        <ChartContainer>
          {({ width, height }) => (
            <AreaChart
              width={width}
              height={height}
              data={trendData}
              margin={{ top: 8, right: 10, left: -18, bottom: 0 }}
            >
              <defs>
                <linearGradient id="coverageFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="slot" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ stroke: "#93c5fd", strokeWidth: 1 }}
                formatter={(value) => [
                  `${Number(value ?? 0)}%`,
                  DASHBOARD_CHART_COPY.tooltipCoverage,
                ]}
                contentStyle={{ borderRadius: 12, borderColor: "#cbd5e1" }}
              />
              <Area
                type="monotone"
                dataKey="cobertura"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#coverageFill)"
              />
            </AreaChart>
          )}
        </ChartContainer>
      </article>

      <article className="min-h-[320px] rounded-[24px] border border-white/80 bg-white/90 p-4 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm">
        <header className="mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-900">
            {DASHBOARD_CHART_COPY.operationalTitle}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {DASHBOARD_CHART_COPY.operationalDescription}
          </p>
        </header>
        <ChartContainer>
          {({ width, height }) => (
            <PieChart width={width} height={height}>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={76}
                paddingAngle={2}
              />
              <Tooltip
                contentStyle={{ borderRadius: 12, borderColor: "#cbd5e1" }}
              />
            </PieChart>
          )}
        </ChartContainer>
      </article>

      <article className="min-h-[340px] rounded-[24px] border border-white/80 bg-white/90 p-4 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm xl:col-span-3">
        <header className="mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-900">
            {DASHBOARD_CHART_COPY.delegationTitle}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {DASHBOARD_CHART_COPY.delegationDescription}
          </p>
          {renderRangeButtons()}
        </header>
        <ChartContainer>
          {({ width, height }) => (
            <BarChart
              width={width}
              height={height}
              data={delegationChartData}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontSize: 11 }}
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [
                  `${Number(value ?? 0)}%`,
                  DASHBOARD_CHART_COPY.tooltipCoverage,
                ]}
                contentStyle={{ borderRadius: 12, borderColor: "#cbd5e1" }}
              />
              <Bar
                dataKey="cobertura"
                fill="#0ea5e9"
                isAnimationActive={true}
                shape={(props: any) => {
                  const { x, y, width, height, payload } = props;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={payload?.fill || "#0ea5e9"}
                    />
                  );
                }}
              />
            </BarChart>
          )}
        </ChartContainer>
      </article>
    </section>
  );
}
