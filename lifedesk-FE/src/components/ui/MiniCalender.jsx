import React, { useEffect, useMemo, useState } from "react";
import { getProductivityHistory } from "../../api/taskApi";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";

const MiniCalendar = () => {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [selectedDate, setSelectedDate] = useState(today);

  /*
   * Mock productivity data.
   *
   * Later this will come from:
   * GET /api/tasks/analytics/productivity
   */
  const [activity, setActivity] = useState({});
  const [loading, setLoading] = useState(true);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await getProductivityHistory();

        const activityMap = {};

        data.forEach((item) => {
          activityMap[item.date] = item.completedTasks;
        });

        setActivity(activityMap);
      } catch (error) {
        console.error("Failed to fetch calendar activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  /*
   * First day of the month.
   */
  const firstDay = new Date(year, month, 1);

  /*
   * Number of days in this month.
   */
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  /*
   * Convert Sunday = 0 into Monday = 0.
   */
  const startingDay = (firstDay.getDay() + 6) % 7;

  const calendarDays = useMemo(() => {
    const days = [];

    // Empty cells before first day
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [startingDay, daysInMonth]);

  const formatDateKey = (day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;
  };

  const getActivityLevel = (count) => {
    if (!count) return "bg-slate-50";

    if (count === 1) return "bg-emerald-100";

    if (count === 2) return "bg-emerald-200";

    if (count === 3) return "bg-emerald-300";

    return "bg-emerald-500";
  };

  const isToday = (day) => {
    if (!day) return false;

    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    if (!day) return false;

    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));

    setSelectedDate(today);
  };
  const selectedDateKey = `${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1,
  ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

  const selectedActivity = activity[selectedDateKey] || 0;

  const calculateStreak = () => {
    let streak = 0;
    const date = new Date();

    while (true) {
      const dateKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      if (!activity[dateKey] || activity[dateKey] <= 0) {
        break;
      }

      streak++;

      date.setDate(date.getDate() - 1);
    }

    return streak;
  };

  const streak = calculateStreak();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {monthName} {year}
          </h2>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <Flame size={13} className="text-orange-500" />
            <span>
              {streak > 0 ? `${streak} day streak` : "Start your streak today"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={previousMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
          >
            <ChevronLeft size={17} />
          </button>

          <button
            onClick={goToToday}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Today
          </button>

          <button
            onClick={nextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="mt-6 grid grid-cols-7 text-center">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
          <div key={index} className="text-xs font-medium text-slate-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={index} className="aspect-square" />;
          }

          const dateKey = formatDateKey(day);

          const activityCount = activity[dateKey] || 0;

          return (
            <button
              key={day}
              onClick={() => {
                setSelectedDate(new Date(year, month, day));
              }}
              className={`
                                relative flex aspect-square
                                items-center justify-center
                                rounded-lg text-xs font-medium
                                transition-all duration-150
                                hover:scale-105
                                ${getActivityLevel(activityCount)}
                                ${
                                  isToday(day)
                                    ? "ring-2 ring-slate-900 ring-offset-1"
                                    : ""
                                }
                                ${isSelected(day) ? "shadow-sm" : ""}
                            `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Selected date summary */}
      <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
        <p className="text-xs text-slate-400">
          {selectedDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          })}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-800">
          {selectedActivity} {selectedActivity === 1 ? "task" : "tasks"}{" "}
          completed
        </p>
      </div>

      {/* Legend */}
      <div className="mt-5 flex items-center justify-end gap-1.5 text-[10px] text-slate-400">
        <span>Less</span>

        <span className="h-2.5 w-2.5 rounded-sm bg-slate-50" />
        <span className="h-2.5 w-2.5 rounded-sm bg-emerald-100" />
        <span className="h-2.5 w-2.5 rounded-sm bg-emerald-200" />
        <span className="h-2.5 w-2.5 rounded-sm bg-emerald-300" />
        <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />

        <span>More</span>
      </div>
    </div>
  );
};

export default MiniCalendar;
