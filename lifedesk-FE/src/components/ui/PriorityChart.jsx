import React,{useEffect,useState} from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getTasks } from "../../api/taskApi";

const PriorityChart = ({ refreshTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch priority data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [refreshTrigger]);

  const data = [
    {
      name: "Low",
      value: tasks.filter((task) => task.priority === "LOW").length,
    },
    {
      name: "Medium",
      value: tasks.filter((task) => task.priority === "MEDIUM").length,
    },
    {
      name: "High",
      value: tasks.filter((task) => task.priority === "HIGH").length,
    },
  ];

  const COLORS = ["#10b981", "#6366f1", "#f59e0b"];

  const totalTasks = data.reduce((total, item) => total + item.value, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      {/* Header */}
      <h2 className="text-base font-semibold text-slate-900">Priority</h2>

      {/* Content */}
      <div className="mt-2 flex items-center gap-4">
        {/* Donut */}
        <div className="relative h-28 w-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={52}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((item, index) => (
                  <Cell key={item.name} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-slate-900">
              {totalTasks}
            </span>

            <span className="text-[9px] text-slate-400">tasks</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-1.5">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: COLORS[index],
                  }}
                />

                <span className="text-xs text-slate-500">{item.name}</span>
              </div>

              <span className="text-xs font-semibold text-slate-800">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriorityChart;
