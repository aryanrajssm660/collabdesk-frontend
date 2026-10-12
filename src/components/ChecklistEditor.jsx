import { useState } from "react";
import { IconPlus, IconTrash } from "./Icons";

export default function ChecklistEditor({ items, onChange }) {
  const [draft, setDraft] = useState("");

  const done = items.filter((i) => i.done).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  const addItem = () => {
    if (!draft.trim()) return;
    onChange([...items, { text: draft.trim(), done: false }]);
    setDraft("");
  };

  const toggleItem = (idx) => {
    onChange(items.map((it, i) => (i === idx ? { ...it, done: !it.done } : it)));
  };

  const removeItem = (idx) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {items.length > 0 && (
        <div className="mb-2.5 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full bg-green transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-mono text-[11px] text-text-faint">{pct}%</span>
        </div>
      )}

      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <label
            key={idx}
            className="group flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-surface-2"
          >
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggleItem(idx)}
              className="h-4 w-4 shrink-0 accent-amber"
            />
            <span
              className={`flex-1 text-sm break-words ${
                item.done ? "text-text-faint line-through" : "text-text"
              }`}
            >
              {item.text}
            </span>
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="opacity-0 text-text-faint hover:text-red group-hover:opacity-100"
              aria-label="Remove checklist item"
            >
              <IconTrash />
            </button>
          </label>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder="Add a checklist item"
          className="min-w-0 flex-1 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-text placeholder:text-text-faint focus:border-amber/50"
        />
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs text-text hover:bg-surface-2"
        >
          <IconPlus /> Add
        </button>
      </div>
    </div>
  );
}
