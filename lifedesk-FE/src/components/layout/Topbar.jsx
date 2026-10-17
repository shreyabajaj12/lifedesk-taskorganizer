import React from "react";
import {Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Topbar = ({ setSidebarOpen }) => {
  const {user}=useAuth();
    const userName = user?.name || "User";
  const initials = userName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur">
      {/* Search */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
      >
        <Menu size={21} />
      </button>

      {/* Right section */}
      <div className="flex items-center gap-4 ml-auto">
        

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {initials || "U"}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">{userName || "User"}</p>

            <p className="text-xs text-slate-400">Personal Workspace</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
