import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Flame,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  Clock3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getTaskAnalytics, getProductivityHistory } from "../api/taskApi";
import ProductivityChart from "../components/ui/ProductivityChart";

const Profile = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [activity, setActivity] = useState({});

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getTaskAnalytics();
        const productivityData = await getProductivityHistory();
        const activityMap = {};
        setAnalytics(data);
        productivityData.forEach((item) => {
          activityMap[item.date] = item.completedTasks;
        });
        setActivity(activityMap);
      } catch (error) {
        console.error("Failed to fetch profile analytics:", error);
      }
    };
    fetchAnalytics();
  }, []);
  const getActivityColor = (count) => {
    if (!count) return "bg-slate-100";
    if (count === 1) return "bg-emerald-100";
    if (count === 2) return "bg-emerald-200";
    if (count === 3) return "bg-emerald-300";
    return "bg-emerald-500";
  };
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-slate-400">Your Profile</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Profile
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Track your productivity and progress.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* User */}
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-slate-900 text-2xl font-bold text-white">
              {user?.name
                ?.match(/^[^\W\d_]+/u)?.[0]
                ?.slice(0, 1)
                .toUpperCase() || "U"}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {user?.name?.slice(0, 10) || "User"}
              </h2>

              <div className="mt-2 flex flex-col gap-1 text-sm text-slate-400 sm:flex-row sm:items-center sm:gap-3">
                <span className="flex items-center gap-1.5">
                  <Mail size={14} />
                  {user?.email || "No email"}
                </span>

                <span className="hidden sm:block">•</span>

                <span className="flex items-center gap-1.5">
                  <User size={14} />
                  LifeDesk member
                </span>
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="flex w-fit items-center gap-2 rounded-xl bg-orange-50 px-4 py-2.5">
            <Flame size={17} className="text-orange-500" />

            <span className="text-sm font-semibold text-orange-600">
              1 day streak
            </span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <ListTodo size={19} className="text-slate-600" />
            </div>
          </div>

          <p className="mt-5 text-3xl font-bold text-slate-900">
            {analytics?.totalTasks ?? 0}
          </p>

          <p className="mt-1 text-sm text-slate-400">Total Tasks</p>
        </div>

        {/* Completed */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <CheckCircle2 size={19} className="text-emerald-500" />
            </div>
          </div>

          <p className="mt-5 text-3xl font-bold text-slate-900">
            {analytics?.completedTasks ?? 0}
          </p>

          <p className="mt-1 text-sm text-slate-400">Completed</p>
        </div>

        {/* In Progress */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <Clock3 size={19} className="text-indigo-500" />
            </div>
          </div>

          <p className="mt-5 text-3xl font-bold text-slate-900">
            {analytics?.inProgressTasks ?? 0}
          </p>

          <p className="mt-1 text-sm text-slate-400">In Progress</p>
        </div>

        {/* Progress */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
              <TrendingUp size={19} className="text-violet-500" />
            </div>
          </div>

          <p className="mt-5 text-3xl font-bold text-slate-900">
            {analytics?.overallProgress ?? 0}%
          </p>

          <p className="mt-1 text-sm text-slate-400">Overall Progress</p>
        </div>
      </div>

      {/* Activity */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Activity</h2>

          <p className="mt-1 text-sm text-slate-400">
            Your task completion activity.
          </p>
        </div>

        {/* Placeholder heatmap */}
        <div className="mt-6 overflow-x-auto">
          <div className="flex min-w-[700px] gap-1.5">
            {Array.from({ length: 52 }).map((_, column) => (
              <div key={column} className="flex flex-col gap-1.5">
                {Array.from({ length: 7 }).map((_, row) => {
                  const daysAgo = (51 - column) * 7 + (6 - row);

                  const date = new Date();
                  date.setHours(0, 0, 0, 0);
                  date.setDate(date.getDate() - daysAgo);

                  const dateKey = [
                    date.getFullYear(),
                    String(date.getMonth() + 1).padStart(2, "0"),
                    String(date.getDate()).padStart(2, "0"),
                  ].join("-");

                  const count = activity[dateKey] || 0;

                  return (
                    <div
                      key={dateKey}
                      title={`${date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}: ${count} ${
                        count === 1 ? "task" : "tasks"
                      } completed`}
                      className={`h-3.5 w-3.5 rounded-[3px] ${getActivityColor(
                        count,
                      )}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2 text-xs text-slate-400">
          <span>Less</span>

          <span className="h-3 w-3 rounded-[3px] bg-slate-100" />
          <span className="h-3 w-3 rounded-[3px] bg-emerald-100" />
          <span className="h-3 w-3 rounded-[3px] bg-emerald-200" />
          <span className="h-3 w-3 rounded-[3px] bg-emerald-300" />
          <span className="h-3 w-3 rounded-[3px] bg-emerald-500" />

          <span>More</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Productivity */}
        <div className="mt-6">
          <ProductivityChart />
        </div>

        {/* Insights */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Insights</h2>

          <p className="mt-1 text-sm text-slate-400">
            Understand your productivity patterns.
          </p>

          <div className="mt-6 space-y-3">
            <div className="rounded-xl bg-slate-50 px-4 py-4">
              <p className="text-sm font-medium text-slate-700">
                💡 Keep completing tasks to build your productivity history.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-4">
              <p className="text-sm font-medium text-slate-700">
                📈 Your productivity insights will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
