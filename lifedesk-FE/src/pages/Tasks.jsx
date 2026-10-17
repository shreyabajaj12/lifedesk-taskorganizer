import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import TaskCard from "../components/ui/TaskCard";
import TaskModal from "../components/ui/TaskModal";
import DeleteTaskModal from "../components/ui/DeleteTaskModal";
import {  getTasks,createTask, updateTask, deleteTask } from "../api/taskApi";

const Tasks = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [loading,setLoading]=useState(true);

  const [taskToDelete, setTaskToDelete] = useState(null);

  const [editingTask, setEditingTask] = useState(null);

  const [search, setSearch]=useState("");
  const [priority,setPriority]=useState("");
  const [status,setStatus]=useState("");
  const [sort, setSort]=useState("newest");

  const filteredTasks =
    activeTab === "ALL"
      ? tasks
      : tasks.filter((task) => task.status === activeTab);
  const handleEdit = (task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };
  const handleDelete = (task) => {
    setTaskToDelete(task);
  };
  const confirmDelete = (task) => {
    setTasks((prev) => prev.filter((item) => item.id != task.id));
    setTaskToDelete(null);
  };

  useEffect(()=>{
    const fetchTaks=async()=>{
      try {
        const data =await getTasks({
          search: search,
          status: status,
          priority: priority,
          sort: sort
        });
        setTasks(data);
      } catch (error) {
        console.log("failed to fetch tasks:",error);
      }
      finally{
        setLoading(false);
      }
    }
    fetchTaks();
  },[search,status,priority,sort]);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Tasks
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Organize your work and stay on top of your goals.
          </p>
        </div>

        <button
          onClick={() => setTaskModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
        >
          <Plus size={17} />
          New Task
        </button>
      </div>
      {/* Search & Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative min-w-0 flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            />
          </div>

          {/* Sliding Filters */}
          <div className="flex max-w-[55%] shrink-0 items-center gap-2 overflow-x-auto scrollbar-none">
            <select
            value={status}
            onChange={(e)=>setStatus(e.target.value)}
             className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none">
              <option value="">All Status</option>
              <option value= "TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <select 
            value={priority}
            onChange={(e)=>setPriority(e.target.value)}
            className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none">
              <option value="">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            <select
            value={sort}
            onChange={(e)=>setSort(e.target.value)} 
            className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200">
        {[
          { label: "All", value: "ALL" },
          { label: "Todo", value: "TODO" },
          { label: "In Progress", value: "IN_PROGRESS" },
          { label: "Completed", value: "COMPLETED" },
        ].map((tab) => {
          const count =
            tab.value === "ALL"
              ? tasks.length
              : tasks.filter((task) => task.status === tab.value).length;

          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`relative shrink-0 px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}

              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>

              {isActive && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-slate-900" />
              )}
            </button>
          );
        })}
      </div>
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        editingTask={editingTask}
        onCreate={async (taskData)=>{
          try{
          const createdTask=await createTask(taskData);
          setTasks((prev)=>[...prev,createdTask]);
          setTaskModalOpen(false);
        }
        catch(error){
          console.log("failed to create task:",error);
        }
        }}
        onUpdate={async (taskData)=>{
          try{
            const updatedTask=await updateTask(
              editingTask.id,taskData
            );
            setTasks((prev)=>
              prev.map((task)=>
                task.id==updatedTask.id?
            updatedTask:task
            )
            );
            setEditingTask(null);
            setTaskModalOpen(false);
          }
          catch(error){
            console.log("failed to update the task:",error);
          }
        }}
      />
      <DeleteTaskModal
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={async()=>{
          try {
            await deleteTask(taskToDelete.id);
            setTasks((prev)=>
            prev.filter((task)=>task.id !==taskToDelete.id));
            setTaskToDelete(null);
          } catch (error) {
            console.log("failed to delete task:", error);
          }
        }}
      />
    </div>
  );
};

export default Tasks;
