import React from "react";
import { Flame, TrendingUp, Clock3, ArrowUpRight } from "lucide-react";

const ProductivityInsights = () => {
  const insights = [
    {
      icon: Flame,
      title: "7 day streak",
      description: "Keep your momentum going.",
      iconStyle: "bg-orange-50 text-orange-500",
    },
    {
      icon: TrendingUp,
      title: "+18% this week",
      description: "More tasks completed than last week.",
      iconStyle: "bg-emerald-50 text-emerald-500",
    },
    {
      icon: Clock3,
      title: "2 deadlines",
      description: "Need your attention soon.",
      iconStyle: "bg-amber-50 text-amber-500",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Productivity Insights
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            A quick look at how you're doing.
          </p>
        </div>

        <button className="flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-slate-900">
          Details
          <ArrowUpRight size={13} />
        </button>
      </div>

      <div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-3 md:divide-x md:divide-y-0">
        {insights.map((insight) => {
          const Icon = insight.icon;

          return (
            <div
              key={insight.title}
              className="flex items-center gap-3 px-3 py-3 first:pl-0 last:pr-0"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${insight.iconStyle}`}
              >
                <Icon size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">
                  {insight.title}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  {insight.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductivityInsights;
