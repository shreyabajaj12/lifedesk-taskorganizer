import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  CalendarDays,
  User,
  Settings,
  X,
  Sparkles,
} from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: ListTodo,
    },
    {
      name: "Daily Plan",
      path: "/daily-plan",
      icon: CalendarDays,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`
                fixed inset-y-0 left-0 z-50
                w-64
                md:w-[clamp(200px,20vw,256px)]
                max-md:w-64
                border-r border-slate-200 bg-white
                transform transition-transform duration-300 ease-in-out
                md:translate-x-0
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
            L
          </div>

          <span className="text-lg font-bold text-slate-900">LifeDesk</span>
        </div>

        {/* Mobile close */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 px-3 py-5">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom card */}
      <div className="absolute bottom-5 left-3 right-3 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-semibold text-slate-700">Stay consistent</p>

        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          Small progress every day adds up.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
