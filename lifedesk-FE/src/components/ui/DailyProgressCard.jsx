import React from "react";
import { CheckCircle2, Clock3, Target } from "lucide-react";

const DailyProgressCard = ({ tasks }) => {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED",
  ).length;

  const totalMinutes = tasks.reduce(
    (sum, task) => sum + task.estimatedMinutes,
    0,
  );

  const completedMinutes = tasks
    .filter((task) => task.status === "COMPLETED")
    .reduce((sum, task) => sum + task.estimatedMinutes, 0);

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
          <Target size={19} className="text-indigo-500" />
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Today's Progress
          </h2>

          <p className="text-xs text-slate-400">Keep moving forward.</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold tracking-tight text-slate-900">
              {progress}%
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>

          <CheckCircle2 size={22} className="mb-1 text-emerald-500" />
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900 transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* Time stats */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock3 size={14} />

            <span className="text-[11px] font-medium">Completed</span>
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {completedMinutes} min
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock3 size={14} />

            <span className="text-[11px] font-medium">Planned</span>
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {totalMinutes} min
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyProgressCard;
