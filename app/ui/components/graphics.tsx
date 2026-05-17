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
import { type TrendPoint } from "@/app/lib/dashboard-analytics";

type GraphicProps<T> = {
  width: number;
  height: number;
  data: T[];
};

export function PieGraphic({
  width,
  height,
  data,
}: GraphicProps<{
  name: string;
  value: number;
  fill: string;
}>) {
  return (
    <PieChart width={width} height={height}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        innerRadius={45}
        outerRadius={76}
        paddingAngle={2}
      />
      <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#cbd5e1" }} />
    </PieChart>
  );
}

export function BarGraphic({
  width,
  height,
  data,
}: GraphicProps<{
  fill: string;
  name: string;
  cobertura: number;
}>) {
  return (
    <BarChart
      width={width}
      height={height}
      data={data}
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
      <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 12 }} />
      <Tooltip
        formatter={(value) => [`${Number(value ?? 0)}%`, "Cobertura"]}
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
  );
}

export function AreaGraphic({ width, height, data }: GraphicProps<TrendPoint>) {
  return (
    <AreaChart
      width={width}
      height={height}
      data={data}
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
      <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 12 }} />
      <Tooltip
        cursor={{ stroke: "#93c5fd", strokeWidth: 1 }}
        formatter={(value) => [`${Number(value ?? 0)}%`, "Cobertura"]}
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
  );
}
