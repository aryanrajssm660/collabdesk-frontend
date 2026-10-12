import { useState } from "react";
import { IconPlus, IconX } from "./Icons";
import { LABEL_COLORS, colorFor } from "../lib/labelColors";

export default function LabelPicker({ labels, onChange }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(LABEL_COLORS[0].key);

  const addLabel = () => {
    if (!name.trim()) return;
    onChange([...labels, { name: name.trim(), color }]);
    setName("");
    setColor(LABEL_COLORS[0].key);
    setOpen(false);
  };

  const removeLabel = (idx) => {
    onChange(labels.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        {labels.map((l, idx) => {
          const c = colorFor(l.color);
          return (
            <span
              key={`${l.name}-${idx}`}
              className={`inline-flex items-center gap-1 rounded-full ${c.bg} ${c.text} px-2.5 py-1 text-[11px] font-medium`}
            >
              {l.name}
              <button
                type="button"
                onClick={() => removeLabel(idx)}
                className="opacity-70 hover:opacity-100"
                aria-label={`Remove ${l.name} label`}
              >
                <IconX />
              </button>
            </span>
          );
        })}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-1 text-[11px] text-text-muted hover:border-amber/50 hover:text-amber"
        >
          <IconPlus /> Label
        </button>
      </div>

      {open && (
        <div className="mt-2.5 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface-2 p-2.5">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addLabel();
              }
            }}
            placeholder="Label name"
            className="min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-xs text-text placeholder:text-text-faint focus:border-amber/50"
          />
          <div className="flex items-center gap-1">
            {LABEL_COLORS.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setColor(c.key)}
                className={`h-5 w-5 rounded-full ${c.bg} transition ${
                  color === c.key ? "ring-2 ring-offset-2 ring-offset-surface-2 ring-text" : "opacity-70"
                }`}
                aria-label={c.key}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={addLabel}
            className="rounded-md bg-amber px-2.5 py-1.5 text-xs font-semibold text-bg hover:bg-amber-dim"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
