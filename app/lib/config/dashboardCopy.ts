export const DASHBOARD_KPI_COPY = {
  totalUsers: "Total Usuarios",
  delegations: "Delegaciones",
  ambulances: "Ambulancias",
  activeGuards: "Guardias Activas",
} as const;

export const DASHBOARD_CHART_COPY = {
  trendTitle: "Tendencia de cobertura",
  trendDescription:
    "Evolucion de cobertura operativa basada en registros recientes.",
  operationalTitle: "Estado operativo",
  operationalDescription: "Distribucion actual de guardias y alertas.",
  delegationTitle: "Cobertura por delegacion",
  delegationDescription:
    "Cobertura promedio por delegacion en el periodo seleccionado.",
  tooltipCoverage: "Cobertura",
  statusSeries: {
    active: "Activas",
    pending: "Nuevas",
    critical: "Criticas",
  },
} as const;

export const DASHBOARD_SECTIONS_COPY = {
  guards: {
    title: "Centro Operativo",
    subtitle: "Prioridades activas y siguientes acciones.",
    needsAttentionTitle: "Requiere atencion",
    topCriticalTitle: "Top 3 insumos criticos",
    nextHoursTitle: "Proximas 4 horas",
    mobileCoverageLabel: "Cobertura estimada actual",
  },
  delegation: {
    title: "Estado por Delegacion",
    subtitle: "Cobertura, disponibilidad y riesgo operativo.",
    unitCoverageLabel: "Cobertura de unidad",
    availableLabel: "Disponibles",
    pendingLabel: "Pendientes",
  },
} as const;
