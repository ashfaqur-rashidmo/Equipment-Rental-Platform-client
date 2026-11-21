import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

type MonthlySpendingChartProps = {
  data: { month: string; amount: number }[];
};

const MonthlySpendingChart = ({ data }: MonthlySpendingChartProps) => {
  return (
    <div className="w-full max-w-md">
      <ResponsiveContainer width="100%" height={190}>
        <AreaChart
          data={data}
          margin={{ top: 16, right: 16, bottom: 8, left: 44 }}
        >
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "currentColor" }}
            stroke="transparent"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-base-100)",
              borderColor: "var(--color-base-300)",
              borderRadius: "0.5rem",
            }}
            labelStyle={{ color: "var(--color-base-content)" }}
            formatter={(value) =>
              value == null ? "" : Number(value).toLocaleString("en-US")
            }
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="var(--color-primary)"
            strokeWidth={2.5}
            fill="var(--color-primary)"
            fillOpacity={0.15}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySpendingChart;
