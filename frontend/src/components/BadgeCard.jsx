import React from "react";

export default function BadgeCard({ badge }) {
  return (
    <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition transform hover:-translate-y-1">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">
          ⭐
        </div>
        <div>
          <h3 className="font-medium">{badge.badge?.title || badge.title}</h3>
          <p className="text-xs text-slate-500">{badge.badge?.criteria_days ? `${badge.badge.criteria_days}-day streak` : badge.criteria || ""}</p>
        </div>
      </div>
    </div>
  );
}
