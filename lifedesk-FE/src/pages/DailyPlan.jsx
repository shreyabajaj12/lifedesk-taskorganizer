import React, { useEffect, useState } from "react";
import { CalendarCheck2 } from "lucide-react";
import TodaysPlanCard from "../components/ui/TodaysPlanCard";
import DailyProgressCard from "../components/ui/DailyProgressCard";
import AddExistingTaskModal from "../components/ui/AddExisitingTaskModel";
import {
  addTaskToTodayPlan,
  getTodayPlan,
  removeTaskFromTodayPlan,
} from "../api/dailyPlanApi";
import { getTasks, createTask } from "../api/taskApi";
import TaskModal from "../components/ui/TaskModal";

const DailyPlan = () => {
  const [allTasks, setAllTasks] = useState([]);
  const today = new Date();
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planTasks, allTasksData] = await Promise.all([
          getTodayPlan(),
          getTasks(),
        ]);
        console.log("todays plan", planTasks);
        console.log("all tasks", allTasksData);
        setTodaysTasks(planTasks);
        setAllTasks(allTasksData);
      } catch (error) {
        console.log("faileed to load daily plan data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
              <CalendarCheck2 size={18} className="text-slate-700" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Daily Plan
            </h1>
          </div>

          <p className="mt-2 text-sm font-medium text-slate-500">
            {formattedDate}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Plan your day and focus on what matters.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.8fr)]">
        <TodaysPlanCard
          tasks={todaysTasks}
          onAddTask={() => setIsAddTaskModalOpen(true)}
          onCreateAndAdd={() => setIsCreateTaskModalOpen(true)}
          onRemoveTask={async (taskId) => {
            try {
              await removeTaskFromTodayPlan(taskId);

              setTodaysTasks((prev) =>
                prev.filter((task) => task.id !== taskId),
              );
            } catch (error) {
              console.error("Failed to remove task from today's plan:", error);
            }
          }}
        />
        <DailyProgressCard tasks={todaysTasks} />
      </div>

      <AddExistingTaskModal
        isOpen={isAddTaskModalOpen}
        tasks={allTasks}
        onClose={() => setIsAddTaskModalOpen(false)}
        existingTaskIds={todaysTasks.map((task) => task.id)}
        onAddTasks={async (selectedTaskIds) => {
          try {
            const addedTasks = await Promise.all(
              selectedTaskIds.map((taskId) => addTaskToTodayPlan(taskId)),
            );
            setTodaysTasks((prev) => [
              ...prev,
              ...addedTasks.map((item) => item.task),
            ]);
          } catch (error) {
            console.error("failed to add task ", error);
          }
        }}
      />
      <TaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        editingTask={null}
        createAndAdd={true}
        onCreate={async (taskData) => {
          try {
            const createdTask = await createTask(taskData);

            const addedTask = await addTaskToTodayPlan(createdTask.id);

            setTodaysTasks((prev) => [...prev, addedTask.task]);

            setAllTasks((prev) => [...prev, createdTask]);

            setIsCreateTaskModalOpen(false);
          } catch (error) {
            console.error("Failed to create and add task:", error);
          }
        }}
      />
    </div>
  );
};

export default DailyPlan;
