import React, { useMemo, useState ,useEffect} from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getProductivityHistory } from "../../api/taskApi";

const ProductivityChart = ({refreshTrigger}) => {
  const [range, setRange] = useState("7");

  const [productivityData, setProductivityData] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProductivity = async () => {
      try {
        const data = await getProductivityHistory();
        setProductivityData(data);
      } catch (error) {
        console.error("Failed to fetch productivity history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductivity();
  }, [refreshTrigger]);

  const chartData = useMemo(() => {
    const days = Number(range);

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days + 1);

    return productivityData
      .filter((item) => {
        const date = new Date(item.date);
        return date >= cutoff;
      })
      .map((item) => ({
        day: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        completed: item.completedTasks,
      }));
  }, [productivityData, range]);

  const average = useMemo(() => {
    if (chartData.length === 0) return 0;

    const total = chartData.reduce((sum, item) => sum + item.completed, 0);

    return (total / chartData.length).toFixed(1);
  }, [chartData]);

  const bestDay = useMemo(() => {
    if (chartData.length === 0) return null;

    return chartData.reduce((best, current) =>
      current.completed > best.completed ? current : best,
    );
  }, [chartData]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Productivity over time
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Completed tasks across your selected period
          </p>
        </div>

        {/* Range selector */}
        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          {[
            { label: "7 days", value: "7" },
            { label: "30 days", value: "30" },
            { label: "3 months", value: "90" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setRange(option.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                range === option.value
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="mt-8 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="productivityGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />

                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "#94a3b8",
              }}
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "#94a3b8",
              }}
            />

            <Tooltip
              cursor={{
                stroke: "#cbd5e1",
                strokeDasharray: "4 4",
              }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
              labelStyle={{
                color: "#64748b",
                fontSize: "12px",
              }}
              formatter={(value) => [`${value} tasks`, "Completed"]}
            />

            <Area
              type="monotone"
              dataKey="completed"
              stroke="#6366f1"
              strokeWidth={3}
              fill="url(#productivityGradient)"
              dot={{
                r: 4,
                fill: "#6366f1",
                strokeWidth: 2,
                stroke: "#ffffff",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom insight */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-400">Average</p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {average} tasks / day
          </p>
        </div>

        <div>
          <p className="text-right text-xs text-slate-400">Best day</p>

          <p className="mt-1 text-right text-sm font-semibold text-emerald-600">
           {bestDay
        ? `${bestDay.day} · ${bestDay.completed} tasks`
        : "No completed tasks"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductivityChart;
