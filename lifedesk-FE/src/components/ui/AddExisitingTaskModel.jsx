import { useMemo, useState } from "react";
import { Search, X, Check } from "lucide-react";


export default function AddExistingTaskModal({
  isOpen,
  tasks,
  onClose,
  existingTaskIds = [],
  onAddTasks,
}) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const availableTasks = useMemo(() => {
    return tasks.filter((task) => {
      const alreadyAdded = existingTaskIds.includes(task.id);

      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      return !alreadyAdded && matchesSearch && task.status !="COMPLETED";
    });
  }, [search, existingTaskIds,tasks]);

  const toggleTask = (taskId) => {
    setSelectedIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  const handleAdd = () => {
    onAddTasks(selectedIds);

    setSelectedIds([]);
    setSearch("");
    onClose();
  };

  const handleClose = () => {
    setSelectedIds([]);
    setSearch("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Add from My Tasks
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose tasks you want to focus on today.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search your tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            />
          </div>
        </div>

        {/* Task list */}
        <div className="max-h-[360px] space-y-2 overflow-y-auto px-5 py-4">
          {availableTasks.length > 0 ? (
            availableTasks.map((task) => {
              const selected = selectedIds.includes(task.id);

              return (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                    selected
                      ? "border-indigo-200 bg-indigo-50"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {/* Checkbox */}
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                      selected
                        ? "border-indigo-500 bg-indigo-500 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {selected && <Check size={14} strokeWidth={3} />}
                  </div>

                  {/* Task info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {task.title}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span>{task.category}</span>
                      <span>•</span>
                      <span>{task.estimatedMinutes} min</span>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-slate-600">
                No tasks found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try a different search.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
          <p className="text-sm text-slate-500">
            {selectedIds.length} selected
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              onClick={handleAdd}
              disabled={selectedIds.length === 0}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
