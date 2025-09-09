import React, { useEffect, useState } from "react";
import api from "../utils/api";
import HabitForm from "../components/HabitForm";
import CalendarView from "../components/CalendarView";

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabits();
  }, []);

  async function fetchHabits() {
    setLoading(true);
    try {
      const res = await api.get("/habits/");
      setHabits(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function createHabit(data) {
    await api.post("/habits/", data);
    setShowForm(false);
    fetchHabits();
  }

  async function updateHabit(habitId, data) {
    await api.put(`/habits/${habitId}/`, data);
    setEditing(null);
    fetchHabits();
  }

  async function deleteHabit(habitId) {
    if (!confirm("Delete this habit?")) return;
    await api.delete(`/habits/${habitId}/`);
    fetchHabits();
  }

  async function markToday(habit) {
    const today = new Date().toISOString().slice(0, 10);
    try {
      await api.post(`/habits/${habit.id}/logs/`, { date: today, completed: true });
      fetchHabits();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Habits</h2>
          <div>
            <button onClick={() => { setShowForm(!showForm); setEditing(null); }} className="px-3 py-2 bg-indigo-600 text-white rounded-md shadow hover:scale-[0.99] transition">{showForm ? "Close" : "Add Habit"}</button>
          </div>
        </div>

        {showForm && <HabitForm onSave={createHabit} onCancel={() => setShowForm(false)} />}

        {loading ? <p>Loading...</p> : (
          <div className="space-y-3">
            {habits.map((h) => (
              <div key={h.id} className="bg-white p-3 rounded-xl shadow-sm border flex items-start justify-between">
                <div>
                  <div className="font-medium">{h.name}</div>
                  <div className="text-xs text-slate-500">{h.description}</div>
                  <div className="mt-2 flex gap-2 items-center">
                    <button onClick={() => markToday(h)} className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:opacity-90 transition">Mark today</button>
                    <button onClick={() => { setEditing(h.id); setShowForm(true); }} className="px-3 py-1 border rounded-md text-sm">Edit</button>
                    <button onClick={() => deleteHabit(h.id)} className="px-3 py-1 border rounded-md text-sm text-red-600">Delete</button>
                    <button onClick={() => setSelectedHabit(h)} className="px-3 py-1 border rounded-md text-sm">Calendar</button>
                  </div>
                </div>

                <div className="text-right text-sm">
                  <div className="text-slate-600">Created</div>
                  <div className="font-medium">{new Date(h.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}

            {/* Inline edit form for currently editing habit */}
            {editing && (
              <div>
                <h4 className="font-semibold">Edit habit</h4>
                <HabitForm
                  initial={habits.find((x) => x.id === editing)}
                  onSave={(d) => updateHabit(editing, d)}
                  onCancel={() => { setEditing(null); setShowForm(false); }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <aside>
        <div className="bg-white p-4 rounded-xl shadow-sm border space-y-3">
          <h3 className="font-medium">Quick actions</h3>
          <p className="text-sm text-slate-500">Open a habit calendar to view / toggle past completions</p>
          <div className="mt-3 space-y-2">
            {habits.slice(0, 3).map((h) => (
              <div key={h.id} className="flex items-center justify-between">
                <div>{h.name}</div>
                <button onClick={() => setSelectedHabit(h)} className="text-indigo-600 text-sm">Open</button>
              </div>
            ))}
          </div>
        </div>

        {selectedHabit && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">{selectedHabit.name} — Calendar</h3>
            <CalendarView habitId={selectedHabit.id} />
            <div className="mt-2">
              <button onClick={() => setSelectedHabit(null)} className="mt-3 px-3 py-2 border rounded-md">Close</button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
