import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../utils/api";
import { format } from "date-fns";

export default function CalendarView({ habitId }) {
  const [logs, setLogs] = useState([]); // list of {date, completed}

  useEffect(() => {
    fetchLogs();
  }, [habitId]);

  async function fetchLogs() {
    try {
      const res = await api.get(`/habits/${habitId}/logs/`);
      setLogs(res.data.map((l) => ({ date: l.date, completed: l.completed, id: l.id })));
    } catch (e) {
      console.error(e);
    }
  }

  function tileContent({ date, view }) {
    if (view !== "month") return null;
    const iso = format(date, "yyyy-MM-dd");
    const hit = logs.find((l) => l.date === iso);
    if (hit && hit.completed)
      return <div className="w-3 h-3 bg-green-500 rounded-full mt-1 mx-auto" />;
    return null;
  }

  async function onDateClick(date) {
    const iso = format(date, "yyyy-MM-dd");
    const existing = logs.find((l) => l.date === iso);
    try {
      const res = await api.post(`/habits/${habitId}/logs/`, { date: iso, completed: !(existing?.completed) });
      // update logs
      await fetchLogs();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border">
      <Calendar
        onClickDay={onDateClick}
        tileContent={tileContent}
      />
      <p className="text-xs text-slate-500 mt-2">Click a date to toggle completion</p>
    </div>
  );
}
