import React, { useEffect, useState } from "react";
import StatCard from "../components/ui/StatCard";
import {
  CalendarDays,
  ListTodo,
  CheckCircle2,
  Clock3,
  TrendingUp,
  X
} from "lucide-react";
import TodaysPlan from "../components/ui/TodaysPlan";

import MiniCalendar from "../components/ui/MiniCalender";
import ProductivityChart from "../components/ui/ProductivityChart";
import UpcomingDeadlines from "../components/ui/UpcomingDeadlines";
import TaskStatusChart from "../components/ui/TaskStatusChart";
import ThoughtOfTheDay from "../components/ui/ThoughtOfTheDay";
import PriorityChart from "../components/ui/PriorityChart";
import { getTaskAnalytics } from "../api/taskApi";
import { useAuth } from "../context/AuthContext";
import { startGoogleCalendarConnection } from "../api/calendarApi";
import {
  getGoogleCalendarStatus,
  createGoogleCalendarEvent,
} from "../api/calendarApi";

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prooductivityRefresh, setProductivityRefresh] = useState(0);
  const [showCalendarForm, setShowCalendarForm] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarSubmitting, setCalendarSubmitting] = useState(false);
  const [calendarError, setCalendarError] = useState("");
  const [calendarSuccess, setCalendarSuccess] = useState("");
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  const fetchAnalytics = async () => {
    try {
      const data = await getTaskAnalytics();
      console.log("Dashboard analytics:", data);
      setAnalytics(data);
    } catch (error) {
      console.log("failed to fetch dashboard analytics", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const connectGoogleCalendar = async () => {
    setCalendarLoading(true);
    setCalendarError("");
    setCalendarSuccess("");
    try {
      const status = await getGoogleCalendarStatus();
      if (!status.connected) {
        const data = await startGoogleCalendarConnection();
        if (!data?.authorizationUrl) {
          throw new Error("Google authorization URL was not returned.");
        }
        window.location.href = data.authorizationUrl;
        return;
      }
      setShowCalendarForm(true);
    } catch (error) {
      console.error("Calendar connection failed: ", error);
      setCalendarError(
        error.response?.data?.error ||
          error.message ||
          "Unable to check Google Calendar connection.",
      );
    } finally {
      setCalendarLoading(false);
    }
  };
  const handleCalendarSubmit = async (event) => {
    event.preventDefault();
    setCalendarError("");
    setCalendarSuccess("");
    if (!eventData.title.trim() || !eventData.startTime || !eventData.endTime) {
      setCalendarError("Please fill in the title, start time, and end time.");
      return;
    }
    if (
      new Date(eventData.endTime).getTime <
      new Date(eventData.startTime).getTime()
    ) {
      setCalendarError("End time must be after start time");
      return;
    }
    setCalendarSubmitting(true);
    try {
      const result = await createGoogleCalendarEvent({
        title: eventData.title.trim(),
        description: eventData.description.trim(),
        startTime: eventData.startTime,
        endTime: eventData.endTime,
      });
      setCalendarSuccess(
        result.eventLink
          ? `Event created successfully! ${result.eventLink}`
          : "Event created successfully!",
      );
      setEventData({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
      });
      setShowCalendarForm(false);
    } catch (error) {
      console.error("Calendar event creation failed:", error);

      setCalendarError(
        error.response?.data?.error ||
          "Unable to create the Google Calendar event.",
      );
    } finally {
      setCalendarSubmitting(false);
    }
  };

  const stats = [
    {
      title: "Total Tasks",
      value: analytics?.totalTasks ?? 0,
      description: "All your tasks",
      icon: ListTodo,
    },
    {
      title: "Completed",
      value: analytics?.completedTasks ?? 0,
      description: "Tasks completed",
      icon: CheckCircle2,
    },
    {
      title: "In Progress",
      value: analytics?.inProgressTasks ?? 0,
      description: "Currently working on",
      icon: Clock3,
    },
    {
      title: "Overall Progress",
      value: `${analytics?.overallProgress ?? 0}%`,
      description: "Keep pushing forward",
      icon: TrendingUp,
    },
  ];
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const hour = today.getHours();

  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{formattedDate}</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {greeting},{" "}
            {user?.name?.match(/^[A-Za-z]+/)?.[0]?.slice(0, 10) || "there"} 👋
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Let's make today productive and meaningful.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={connectGoogleCalendar}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <CalendarDays size={17} />
            {calendarLoading
              ? "Checking calendar..."
              : "Add to Google Calendar"}
          </button>
        </div>
      </div>
      {/* stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
          />
        ))}
      </div>
      {/* today's plan */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.8fr)]">
        {/* LEFT */}
        <div className="space-y-6">
          <TodaysPlan
            onTaskUpdated={() => {
              fetchAnalytics();
              setProductivityRefresh((prev) => prev + 1);
            }}
          />

          <ProductivityChart refreshTrigger={prooductivityRefresh} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TaskStatusChart refreshTrigger={prooductivityRefresh} />

            <PriorityChart refreshTrigger={prooductivityRefresh} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <UpcomingDeadlines />

          <MiniCalendar />

          <ThoughtOfTheDay />
        </div>
      </div>

      {/*calendar adding  */}
      {calendarError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {calendarError}
        </div>
      )}

      {calendarSuccess && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {calendarSuccess}
        </div>
      )}

      {showCalendarForm && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/40 p-4">
          <form
            onSubmit={handleCalendarSubmit}
            className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Add to Google Calendar
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Create an event in your connected calendar.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowCalendarForm(false);
                  setCalendarError("");
                }}
                aria-label="Close calendar form"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Event title *
              </label>
              <input
                required
                maxLength={200}
                value={eventData.title}
                onChange={(e) =>
                  setEventData({ ...eventData, title: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                placeholder="e.g. Complete project"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                maxLength={5000}
                rows={3}
                value={eventData.description}
                onChange={(e) =>
                  setEventData({ ...eventData, description: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                placeholder="Add details..."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Start date and time *
              </label>
              <input
                required
                type="datetime-local"
                value={eventData.startTime}
                onChange={(e) =>
                  setEventData({ ...eventData, startTime: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                End date and time *
              </label>
              <input
                required
                type="datetime-local"
                value={eventData.endTime}
                onChange={(e) =>
                  setEventData({ ...eventData, endTime: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCalendarForm(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={calendarSubmitting}
                className="rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
              >
                {calendarSubmitting ? "Creating event..." : "Add event"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
