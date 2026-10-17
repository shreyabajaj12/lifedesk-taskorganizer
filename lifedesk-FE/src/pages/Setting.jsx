import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <p className="text-sm font-medium text-slate-400">
          Preferences
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your LifeDesk preferences.
        </p>
      </div>

      {/* Account */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Account
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Manage your LifeDesk session.
          </p>
        </div>

        <div className="flex items-center justify-between px-6 py-5">

          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <LogOut size={19} className="text-red-500" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Sign out
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Sign out of your LifeDesk account.
              </p>
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
};

export default Settings;