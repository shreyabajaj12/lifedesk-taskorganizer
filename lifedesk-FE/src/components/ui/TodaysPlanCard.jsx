import React from "react";
import { CheckCircle2, Circle, Clock3, Plus, X } from "lucide-react";

const TodaysPlanCard = ({ tasks, onAddTask, onCreateAndAdd, onRemoveTask }) => {
  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED",
  ).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Today's Plan
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Focus on what matters today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddTask}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
          >
            <Plus size={15} />
            Add from My Tasks
          </button>
          <button
            onClick={onCreateAndAdd}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Plus size={15} />
            Create & Add
          </button>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {completedTasks}/{tasks.length} done
          </span>
        </div>
      </div>

      {/* Tasks */}
      <div className="mt-5 space-y-2">
        {tasks.map((task) => {
          const completed = task.status === "COMPLETED";

          const inProgress = task.status === "IN_PROGRESS";

          return (
            <div
              key={task.id}
              className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-slate-50"
            >
              {/* Status */}
              {completed ? (
                <CheckCircle2 size={19} className="shrink-0 text-emerald-500" />
              ) : (
                <Circle
                  size={19}
                  className={`shrink-0 ${
                    inProgress ? "text-indigo-400" : "text-slate-300"
                  }`}
                />
              )}

              {/* Task information */}
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-medium ${
                    completed ? "text-slate-400 line-through" : "text-slate-800"
                  }`}
                >
                  {task.title}
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">
                    {task.category}
                  </span>

                  <span className="text-slate-300">•</span>

                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock3 size={11} />
                    {task.estimatedMinutes} min
                  </span>
                </div>
              </div>

              {/* Status */}
              <span
                className={`hidden shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-semibold sm:block ${
                  completed
                    ? "bg-emerald-50 text-emerald-600"
                    : inProgress
                      ? "bg-indigo-50 text-indigo-600"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {completed ? "Completed" : inProgress ? "In Progress" : "Todo"}
              </span>

              {/* Remove */}
              <button
                onClick={() => onRemoveTask(task.id)}
                className="rounded-lg p-1.5 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                title="Remove from today's plan"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodaysPlanCard;
