import { useState } from "react";
import TaskCard from "./TaskCard";
import { IconGrip, IconMore, IconPlus, IconTrash } from "./Icons";
import { colorFor } from "../lib/labelColors";

const TASK_MIME = "application/x-task-id";
const LIST_MIME = "application/x-list-id";

export default function ListColumn({
  list,
  tasks,
  members,
  codeFor,
  onOpenTask,
  onDeleteTask,
  onAddTask,
  onRenameList,
  onDeleteList,
  onDropTask,
  onListDragStart,
  onListDrop,
  isListDragTarget,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(list.name);
  const [cardDragOverIdx, setCardDragOverIdx] = useState(null);
  const [columnDragOver, setColumnDragOver] = useState(false);

  const dot = colorFor(list.color).bg;

  const commitRename = () => {
    setRenaming(false);
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== list.name) {
      onRenameList(list, trimmed);
    } else {
      setNameDraft(list.name);
    }
  };

  const handleCardDrop = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setCardDragOverIdx(null);
    const taskId = e.dataTransfer.getData(TASK_MIME);
    if (taskId) onDropTask(list._id, idx, taskId);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (e.dataTransfer.types.includes(LIST_MIME)) setColumnDragOver(true);
      }}
      onDragLeave={() => setColumnDragOver(false)}
      onDrop={(e) => {
        if (e.dataTransfer.types.includes(LIST_MIME)) {
          e.preventDefault();
          setColumnDragOver(false);
          onListDrop(list);
          return;
        }
        // dropped on empty column area (below last card)
        handleCardDrop(e, tasks.length);
      }}
      className={`flex w-[280px] shrink-0 flex-col rounded-xl border bg-surface p-3 transition ${
        columnDragOver || isListDragTarget ? "border-amber/60 bg-amber/5" : "border-border"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2 px-1">
        <div
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData(LIST_MIME, list._id);
            onListDragStart(list);
          }}
          className="flex min-w-0 flex-1 cursor-grab items-center gap-1.5 active:cursor-grabbing"
        >
          <span className="text-text-faint">
            <IconGrip />
          </span>
          <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
          {renaming ? (
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") {
                  setNameDraft(list.name);
                  setRenaming(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="min-w-0 flex-1 rounded border border-amber/50 bg-surface-2 px-1.5 py-0.5 text-sm text-text"
            />
          ) : (
            <span
              onDoubleClick={() => setRenaming(true)}
              className="truncate text-sm font-medium text-text"
              title="Double-click to rename"
            >
              {list.name}
            </span>
          )}
          <span className="font-mono text-xs text-text-faint">{tasks.length}</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="text-text-faint hover:text-text"
            aria-label="List options"
          >
            <IconMore />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-50 mt-1 w-40 rounded-lg border border-border bg-surface-2 p-1 shadow-xl">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setRenaming(true);
                  }}
                  className="block w-full rounded-md px-2.5 py-1.5 text-left text-xs text-text hover:bg-surface-3"
                >
                  Rename
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDeleteList(list);
                  }}
                  className="flex w-full items-center gap-1.5 rounded-md px-2.5 py-1.5 text-left text-xs text-red hover:bg-red/10"
                >
                  <IconTrash /> Delete list
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex min-h-[60px] flex-1 flex-col gap-2">
        {tasks.map((task, idx) => (
          <div key={task._id}>
            <div
              onDragOver={(e) => {
                if (e.dataTransfer.types.includes(TASK_MIME)) {
                  e.preventDefault();
                  e.stopPropagation();
                  setCardDragOverIdx(idx);
                }
              }}
              onDrop={(e) => handleCardDrop(e, idx)}
              className={`rounded-lg transition-all ${
                cardDragOverIdx === idx ? "border-t-2 border-amber pt-2" : ""
              }`}
            >
              <TaskCard
                task={task}
                code={codeFor(task._id)}
                assignee={members.find((m) => m._id === task.assignedTo)}
                onOpen={onOpenTask}
                onDelete={onDeleteTask}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(TASK_MIME, task._id);
                }}
              />
            </div>
          </div>
        ))}

        <div
          onDragOver={(e) => {
            if (e.dataTransfer.types.includes(TASK_MIME)) {
              e.preventDefault();
              setCardDragOverIdx(tasks.length);
            }
          }}
          onDrop={(e) => handleCardDrop(e, tasks.length)}
          className={`min-h-[30px] flex-1 rounded-lg ${
            cardDragOverIdx === tasks.length ? "border-t-2 border-amber pt-2" : ""
          }`}
        >
          {tasks.length === 0 && (
            <p className="rounded-lg border border-dashed border-border-soft px-3 py-6 text-center text-xs text-text-faint">
              Nothing here
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => onAddTask(list._id)}
        className="mt-2 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-text-muted hover:border-amber/50 hover:text-amber"
      >
        <IconPlus /> Add task
      </button>
    </div>
  );
}
