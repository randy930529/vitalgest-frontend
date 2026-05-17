"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import clsx from "clsx";
import { fetchChartDataByRange } from "@/app/lib/actions/dashboard";
import {
  DASHBOARD_RANGE_OPTIONS,
  type DashboardRange,
  type TrendPoint,
} from "@/app/lib/dashboard-analytics";
import { Badge, BadgeVariant } from "@/app/ui/components/badges";
import {
  AreaGraphic,
  BarGraphic,
  PieGraphic,
} from "@/app/ui/components/graphics";

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

export function ChartHeader({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle?: string;
  badge?: { text: string; type: BadgeVariant };
  children?: React.ReactNode;
}) {
  return (
    <header
      className={clsx("mb-3", {
        "mb-6 flex items-center justify-between gap-3": !!badge,
      })}
    >
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-900">
          {title}
        </h3>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {badge && <Badge title={badge.text} variant={badge.type} />}
      {children}
    </header>
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
      name: "Activas",
      value: activeGuards,
      fill: "#0ea5e9",
    },
    {
      name: "Pendientes",
      value: pendingGuards,
      fill: "#f59e0b",
    },
    {
      name: "Críticas",
      value: criticalSupplyCount,
      fill: "#f43f5e",
    },
  ];

  function RenderRangeButtons() {
    return (
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
  }

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
      <DashboardArticle
        title="Tendencia de cobertura"
        subtitle="Evolucion de cobertura operativa basada en registros recientes."
        childrenHeader={<RenderRangeButtons />}
        extraClassName="xl:col-span-2"
      >
        <ChartContainer>
          {({ width, height }) => (
            <AreaGraphic width={width} height={height} data={trendData} />
          )}
        </ChartContainer>
      </DashboardArticle>

      <DashboardArticle
        title="Estado operativo"
        subtitle="Distribución actual de guardias y alertas."
      >
        <ChartContainer>
          {({ width, height }) => (
            <PieGraphic width={width} height={height} data={statusData} />
          )}
        </ChartContainer>
      </DashboardArticle>

      <DashboardArticle
        title="Cobertura por delegacion"
        subtitle="Cobertura promedio por delegación en el periodo seleccionado."
        childrenHeader={<RenderRangeButtons />}
        extraClassName="xl:col-span-3"
      >
        <ChartContainer>
          {({ width, height }) => (
            <BarGraphic
              width={width}
              height={height}
              data={delegationChartData}
            />
          )}
        </ChartContainer>
      </DashboardArticle>
    </section>
  );
}

function DashboardArticle({
  title,
  subtitle,
  extraClassName,
  children,
  childrenHeader,
}: {
  title: string;
  subtitle?: string;
  extraClassName?: string;
  children?: React.ReactNode;
  childrenHeader?: React.ReactNode;
}) {
  return (
    <article
      className={clsx(
        "min-h-[320px] rounded-[24px] border border-white/80 bg-white/90 p-4 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm",
        extraClassName,
      )}
    >
      <ChartHeader title={title} subtitle={subtitle}>
        {childrenHeader}
      </ChartHeader>
      {children}
    </article>
  );
}
