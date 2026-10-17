import React from "react";
import { AlertTriangle, X } from "lucide-react";

const DeleteTaskModal = ({ task, onClose, onConfirm }) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
            <AlertTriangle size={20} className="text-red-500" />
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold text-slate-900">Delete task?</h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Are you sure you want to delete{" "}
            <span className="font-medium text-slate-700">"{task.title}"</span>?
            This action cannot be undone.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(task)}
            className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
