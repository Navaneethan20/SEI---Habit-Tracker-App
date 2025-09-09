import React, { useState, useEffect } from "react";

export default function HabitForm({ onSave, initial = null, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const saving = false;

  useEffect(() => {
    setName(initial?.name || "");
    setDescription(initial?.description || "");
  }, [initial]);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), description });
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-3">
      <div>
        <label className="text-sm font-medium">Habit name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="e.g. Read 20 mins" />
      </div>
      <div>
        <label className="text-sm font-medium">Description (optional)</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="Add a short note" />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:scale-[0.99] transition">
          {initial ? "Save" : "Create"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-3 py-2 border rounded-md hover:bg-slate-50 transition">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
