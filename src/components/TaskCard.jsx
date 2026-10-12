import { IconCalendar, IconCheckSquare, IconPaperclip, IconTrash } from "./Icons";
import { colorFor } from "../lib/labelColors";

function formatDue(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function isOverdue(dateStr, done) {
  if (done) return false;
  return new Date(dateStr).setHours(23, 59, 59, 999) < Date.now();
}

export default function TaskCard({ task, code, assignee, onOpen, onDelete, draggable, onDragStart }) {
  const checklist = task.checklist || [];
  const checklistDone = checklist.filter((c) => c.done).length;
  const isDone = checklist.length > 0 && checklistDone === checklist.length;
  const overdue = task.dueDate && isOverdue(task.dueDate, isDone);

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={() => onOpen(task)}
      className="group cursor-grab rounded-lg border border-border bg-surface-2 p-3.5 shadow-sm transition hover:border-amber/40 hover:shadow-md active:cursor-grabbing"
    >
      {task.labels?.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {task.labels.map((l, idx) => {
            const c = colorFor(l.color);
            return (
              <span
                key={idx}
                className={`rounded-full ${c.bg} ${c.text} px-2 py-0.5 text-[10px] font-medium`}
              >
                {l.name}
              </span>
            );
          })}
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="font-mono text-[11px] text-text-faint">{code}</span>
        <div className="flex items-center gap-2">
          {assignee && (
            <span
              title={assignee.name}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-3 border border-border text-[10px] font-medium text-text-muted"
            >
              {assignee.name?.[0]?.toUpperCase()}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            className="opacity-0 group-hover:opacity-100 text-text-faint hover:text-red transition"
            aria-label="Delete task"
          >
            <IconTrash />
          </button>
        </div>
      </div>

      <p className="text-sm font-medium text-text leading-snug mb-1.5 break-words">{task.title}</p>

      {task.description && (
        <p className="text-xs text-text-muted line-clamp-2 mb-2 whitespace-pre-line break-words">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
        {task.attachmentUrl && (
          <a
            href={task.attachmentUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[11px] text-teal hover:underline"
          >
            <IconPaperclip /> File
          </a>
        )}

        {checklist.length > 0 && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] ${
              isDone ? "text-green" : "text-text-faint"
            }`}
          >
            <IconCheckSquare /> {checklistDone}/{checklist.length}
          </span>
        )}

        {task.dueDate && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] ${
              overdue ? "text-red" : "text-text-faint"
            }`}
          >
            <IconCalendar /> {formatDue(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
}
