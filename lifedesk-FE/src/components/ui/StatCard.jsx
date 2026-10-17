import React from "react";

const StatCard = ({ title, value, description, icon: Icon }) => {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-start justify-between">
                
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        {value}
                    </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                    <Icon size={20} className="text-slate-700" />
                </div>

            </div>

            <p className="mt-4 text-xs font-medium text-slate-400">
                {description}
            </p>

        </div>
    );
};

export default StatCard;