import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const TaskModal = ({ isOpen, onClose, editingTask, onCreate, onUpdate ,createAndAdd=false}) => {
  const emptyForm = {
    title: "",
    description: "",
    priority: "MEDIUM",
    difficulty: "MEDIUM",
    category: "",
    estimatedMinutes: "",
    deadline: "",
    progress: 0,
  };
  const [form, setForm] = useState(emptyForm);
  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        difficulty: editingTask.difficulty,
        category: editingTask.category,
        estimatedMinutes: editingTask.estimatedMinutes,
        deadline: editingTask.deadline,
        progress: editingTask.progress ?? 0,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingTask]);

  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    if (!form.category.trim()) {
      setError("Please enter a category.");
      return;
    }

    if (!form.estimatedMinutes || Number(form.estimatedMinutes) <= 0) {
      setError("Please enter a valid estimated time.");
      return;
    }

    const taskData = {
      title: form.title.trim(),
      description: form.description.trim() || "No description added.",
      category: form.category.trim(),
      priority: form.priority,
      difficulty: form.difficulty,
      estimatedMinutes: Number(form.estimatedMinutes),
      deadline: form.deadline,
    };

    if (editingTask) {
      onUpdate({
        ...taskData,
        progress: Number(form.progress)
      });
    } else {
      onCreate(taskData);
    }

    setForm(emptyForm);
    setError("");
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editingTask ? "Edit Task" : createAndAdd ? 
              "Create & Add to Today's Plan":"Create New Task"}
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              {editingTask
                ? "Update the details of your task."
                : createAndAdd?
              "Create a task and add it to today's plan":
              "Add something you want to accomplish."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Task title
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                type="text"
                placeholder="e.g. Finish Spring Boot API"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                placeholder="What needs to be done?"
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
              />
            </div>

            {/* Priority + Difficulty */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Priority
                </label>

                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-600 outline-none focus:border-slate-400"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Difficulty
                </label>

                <select
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-600 outline-none focus:border-slate-400"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>

            {/* Category + Estimated time */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Development"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Estimated time
                </label>

                <div className="relative">
                  <input
                    name="estimatedMinutes"
                    value={form.estimatedMinutes}
                    onChange={handleChange}
                    type="number"
                    min="1"
                    placeholder="60"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-14 text-sm outline-none focus:border-slate-400 focus:bg-white"
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    min
                  </span>
                </div>
              </div>
            </div>

            {editingTask && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Progress
                </label>

                <div className="flex items-center gap-3">
                  <input
                    name="progress"
                    value={form.progress}
                    onChange={handleChange}
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    className="flex-1"
                  />

                  <span className="w-12 text-right text-sm font-semibold text-slate-700">
                    {form.progress}%
                  </span>
                </div>
              </div>
            )}

            {/* Deadline */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Deadline
              </label>

              <input
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                type="datetime-local"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-600 outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            {editingTask ? "Save Changes" : createAndAdd? "Create & Add": "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
