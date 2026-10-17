import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock3,
  CalendarDays,
  MoreHorizontal,
} from "lucide-react";

const priorityStyles = {
  HIGH: "bg-red-50 text-red-600 border-red-100",
  MEDIUM: "bg-amber-50 text-amber-600 border-amber-100",
  LOW: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const statusStyles = {
  TODO: "bg-slate-100 text-slate-600",
  IN_PROGRESS: "bg-indigo-50 text-indigo-600",
  COMPLETED: "bg-emerald-50 text-emerald-600",
};

const TaskCard = ({ task ,onEdit, onDelete }) => {
  const isCompleted = task.status === "COMPLETED";

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Top */}
      <div className="flex items-start gap-3">
        {/* Status icon */}
        <button className="mt-0.5 shrink-0">
          {isCompleted ? (
            <CheckCircle2 size={21} className="text-emerald-500" />
          ) : (
            <Circle
              size={21}
              className="text-slate-300 transition group-hover:text-slate-500"
            />
          )}
        </button>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className={`truncate text-sm font-semibold ${
                  isCompleted ? "text-slate-400 line-through" : "text-slate-900"
                }`}
              >
                {task.title}
              </h3>

              <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                {task.description}
              </p>
            </div>

            {/* Actions */}
            <div className="relative shrink-0">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <MoreHorizontal size={18} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-9 z-20 w-32 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  <button
                    onClick={() => {
                      onEdit(task);
                      setMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      onDelete(task);
                      setMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Category */}
            <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
              {task.category}
            </span>

            {/* Priority */}
            <span
              className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium ${
                priorityStyles[task.priority]
              }`}
            >
              {task.priority}
            </span>

            {/* Status */}
            <span
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium ${
                statusStyles[task.status]
              }`}
            >
              {task.status.replace("_", " ")}
            </span>
          </div>

          {/* Bottom information */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Clock3 size={14} />
              {task.estimatedMinutes} min
            </div>

            <div className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              {task.deadline}
            </div>

            <span>{task.difficulty}</span>
          </div>

          {/* Progress */}
          {!isCompleted && (
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">
                  Progress
                </span>

                <span className="text-[11px] font-semibold text-slate-500">
                  {task.progress}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-900 transition-all"
                  style={{
                    width: `${task.progress}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
