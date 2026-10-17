import React, { useEffect, useState } from "react";
import { ArrowRight, CalendarClock } from "lucide-react";
import { getTasks } from "../../api/taskApi";

const UpcomingDeadlines = () => {
  const [deadlines, setDeadLines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const tasks = await getTasks();
        const upcoming = tasks
          .filter((task) => task.deadline && task.status != "COMPLETED")
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
          .slice(0, 5);
        setDeadLines(upcoming);
      } catch (error) {
        console.error("Failed to fetch deadlines:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeadlines();
  }, []);

  const getDeadlineType = (deadline) => {
    const now = new Date();
    const date = new Date(deadline);

    if (date < now) {
      return "overdue";
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    ) {
      return "tomorrow";
    }

    return "upcoming";
  };

  const getDeadlineLabel = (deadline) => {
    const now = new Date();
    const date = new Date(deadline);

    if (date < now) {
      return "Overdue";
    }

    const diffMs = date - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "Due tomorrow";
    }

    return `Due in ${diffDays}d`;
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);

    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  };

  const getStatusStyle = (type) => {
    if (type === "overdue") {
      return "bg-red-50 text-red-600";
    }

    if (type === "tomorrow") {
      return "bg-amber-50 text-amber-600";
    }

    return "bg-emerald-50 text-emerald-600";
  };

  const getDotStyle = (type) => {
    if (type === "overdue") {
      return "bg-red-500";
    }

    if (type === "tomorrow") {
      return "bg-amber-500";
    }

    return "bg-emerald-500";
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock size={18} className="text-slate-700" />

            <h2 className="text-lg font-semibold text-slate-900">
              Upcoming Deadlines
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-400">
            Stay ahead of what's coming next.
          </p>
        </div>

        <button className="text-xs font-medium text-slate-500 transition hover:text-slate-900">
          View all
        </button>
      </div>

      {/* Deadlines */}
      <div className="mt-5 space-y-2.5">
        {deadlines.map((task) => {
          const type = getDeadlineType(task.deadline);
          const label = getDeadlineLabel(task.deadline);
          const formatted = formatDeadline(task.deadline);
          return (
            <div
              key={task.id}
              className="group rounded-xl bg-slate-50 p-3.5 transition hover:bg-slate-100"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {task.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {formatted.date} · {formatted.time}
                  </p>
                </div>

                <span
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusStyle(
                    type
                  )}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${getDotStyle(type)}`}
                  />

                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
        View all deadlines
        <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default UpcomingDeadlines;
