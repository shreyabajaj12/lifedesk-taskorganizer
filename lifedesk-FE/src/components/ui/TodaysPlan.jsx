import React, { useEffect, useState } from "react";
import { CheckCircle2, Circle, Clock3, Plus } from "lucide-react";
import { getTodayPlan,addTaskToTodayPlan } from "../../api/dailyPlanApi";
import { updateTask ,getTasks } from "../../api/taskApi";
import AddExistingTaskModal from "./AddExisitingTaskModel";


const TodaysPlan = ({onTaskUpdated}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
  const fetchTodayPlan = async () => {
    try {
      const [todayPlan, allTasksData] = await Promise.all([
        getTodayPlan(),
        getTasks(),
      ]);

      setTasks(todayPlan);
      setAllTasks(allTasksData);
    } catch (error) {
      console.error("Failed to fetch today's plan:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchTodayPlan();
}, []);

  const handleMarkCompleted = async (task) => {
    try {
      const updatedTask = await updateTask(task.id, {
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        difficulty: task.difficulty,
        estimatedMinutes: task.estimatedMinutes,
        deadline: task.deadline,
        progress: 100,
      });
      setTasks((prev) =>
        prev.map((item) => (item.id === updatedTask.id ? updatedTask : item)),
      );
      onTaskUpdated?.();
    } catch (error) {
      console.error("Failed to mark as completed", error);
    }
  };
  const handleAddTasks = async (selectedTaskIds) => {
  try {
    const addedTasks = await Promise.all(
      selectedTaskIds.map((taskId) => addTaskToTodayPlan(taskId))
    );

    setTasks((prev) => [
      ...prev,
      ...addedTasks.map((item) => item.task),
    ]);

    setShowAddTaskModal(false);
  } catch (error) {
    console.error("Failed to add tasks to today's plan:", error);
  }
};

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED",
  ).length;

  return (
    <>
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Today's Plan</h2>

          <p className="mt-1 text-sm text-slate-400">
            {completedTasks} of {tasks.length} tasks completed
          </p>
        </div>

        <button 
        onClick={()=>setShowAddTaskModal(true)}
        className="flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
          <Plus size={16} />
          Add Task
        </button>
      </div>

      {/* Tasks */}
      <div className="divide-y divide-slate-100">
        {tasks.map((task) => {
          const completed = task.status === "COMPLETED";

          return (
            <div
              key={task.id}
              className="flex items-center gap-4 px-6 py-4 transition hover:bg-slate-50"
            >
              {/* Status icon */}
              {completed ? (
                <CheckCircle2 size={22} className="shrink-0 text-emerald-500" />
              ) : (
                <Circle size={22} className="shrink-0 text-slate-300" />
              )}

              {/* Task information */}
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-medium ${
                    completed ? "text-slate-400 line-through" : "text-slate-800"
                  }`}
                >
                  {task.title}
                </p>

                <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                  <span>{task.category}</span>

                  <span className="flex items-center gap-1">
                    <Clock3 size={12} />
                    {task.estimatedMinutes} min
                  </span>
                </div>
              </div>

              {/* Right side: action + status */}
              <div className="flex shrink-0 items-center gap-2">
                {!completed && (
                  <button
                    onClick={() => handleMarkCompleted(task)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                  >
                    Mark Completed
                  </button>
                )}

                <span
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                    completed
                      ? "bg-emerald-50 text-emerald-600"
                      : task.status === "IN_PROGRESS"
                        ? "bg-indigo-50 text-indigo-600"
                        : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {completed
                    ? "Completed"
                    : task.status === "IN_PROGRESS"
                      ? "In Progress"
                      : "Pending"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
     <AddExistingTaskModal
      isOpen={showAddTaskModal}
      onClose={() => setShowAddTaskModal(false)}
      tasks={allTasks}
      existingTaskIds={tasks.map((task) => task.id)}
      onAddTasks={handleAddTasks}
    />
    </>
  );
};

export default TodaysPlan;
