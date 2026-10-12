import { useRef, useState } from "react";
import api, { getErrorMessage } from "../lib/api";
import { useToast } from "../context/ToastContext";
import { IconClose, IconLoader, IconPaperclip, IconSpark, IconTrash } from "./Icons";
import LabelPicker from "./LabelPicker";
import ChecklistEditor from "./ChecklistEditor";
import CommentSection from "./CommentSection";

export default function TaskModal({
  mode,
  workspaceId,
  task,
  code,
  members = [],
  lists = [],
  defaultListId,
  onClose,
  onCreated,
  onUpdated,
  onDeleteRequest,
}) {
  const toast = useToast();
  const isEdit = mode === "edit";
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [listId, setListId] = useState(task?.list || defaultListId || lists[0]?._id || "");
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo || "");
  const [attachmentUrl] = useState(task?.attachmentUrl || "");
  const [file, setFile] = useState(null);
  const [labels, setLabels] = useState(task?.labels || []);
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ""
  );
  const [checklist, setChecklist] = useState(task?.checklist || []);
  const [comments, setComments] = useState(task?.comments || []);
  const [currentTaskId, setCurrentTaskId] = useState(task?._id || null);

  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFilePick = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const uploadFile = async () => {
    if (!file) return attachmentUrl;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File uploaded");
      return res.data.url;
    } catch (err) {
      toast.error(getErrorMessage(err, "Upload failed"));
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateSubtasks = async () => {
    if (!description.trim()) {
      toast.error("Add a description first so AI has something to break down");
      return;
    }
    setAiLoading(true);
    try {
      const res = await api.post("/ai/generate-subtasks", { description });
      const subtasks = res.data.subtasks || [];
      if (subtasks.length === 0) {
        toast.info("AI didn't return any subtasks");
        return;
      }
      setChecklist((prev) => [...prev, ...subtasks.map((s) => ({ text: s, done: false }))]);
      toast.success(`Added ${subtasks.length} AI-generated subtasks to the checklist`);
    } catch (err) {
      toast.error(getErrorMessage(err, "AI subtask generation failed"));
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Give the task a title");
      return;
    }
    if (!listId) {
      toast.error("Pick a list for this task");
      return;
    }
    setSaving(true);
    try {
      const finalUrl = await uploadFile();
      const payload = {
        title,
        description,
        attachmentUrl: finalUrl,
        assignedTo: assignedTo || null,
        labels,
        dueDate: dueDate || null,
        checklist,
      };

      if (isEdit) {
        const res = await api.put(`/tasks/${task._id}`, { ...payload, list: listId });
        onUpdated(res.data);
        toast.success("Task updated");
      } else {
        const res = await api.post("/tasks", { ...payload, workspace: workspaceId, list: listId });
        onCreated(res.data);
        toast.success("Task created");
      }
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't save task"));
    } finally {
      setSaving(false);
    }
  };

  const busy = saving || uploading;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[90vh] w-full max-w-lg flex-col animate-fade-in-up rounded-2xl border border-border bg-surface shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border-soft p-5">
          <div>
            <h2 className="font-display font-semibold text-text">
              {isEdit ? "Edit task" : "New task"}
            </h2>
            {isEdit && code && <p className="font-mono text-[11px] text-text-faint">{code}</p>}
          </div>
          <button type="button" onClick={onClose} className="text-text-muted hover:text-text">
            <IconClose />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Title</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Set up S3 bucket policy"
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-amber/50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Labels</label>
            <LabelPicker labels={labels} onChange={setLabels} />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-xs font-medium text-text-muted">Description</label>
              <button
                type="button"
                onClick={handleGenerateSubtasks}
                disabled={aiLoading}
                className="inline-flex items-center gap-1 rounded-md bg-amber/10 px-2 py-1 text-[11px] font-medium text-amber hover:bg-amber/20 disabled:opacity-60"
              >
                {aiLoading ? <IconLoader /> : <IconSpark />}
                {aiLoading ? "Thinking…" : "Break down with AI"}
              </button>
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What needs to happen here?"
              className="w-full resize-none rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-amber/50 font-mono"
            />
            <p className="mt-1 text-[11px] text-text-faint">
              AI turns this description into checklist items below.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Checklist</label>
            <ChecklistEditor items={checklist} onChange={setChecklist} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">List</label>
              <select
                value={listId}
                onChange={(e) => setListId(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text focus:border-amber/50"
              >
                {lists.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text focus:border-amber/50"
              />
            </div>
          </div>

          {members.length > 0 && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">Assignee</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text focus:border-amber/50"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Attachment</label>
            <input ref={fileInputRef} type="file" onChange={handleFilePick} className="hidden" />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-text hover:bg-surface-2"
              >
                <IconPaperclip /> {file ? "Change file" : "Attach file"}
              </button>
              {(file || attachmentUrl) && (
                <span className="truncate text-xs text-text-muted">
                  {file ? file.name : attachmentUrl.split("/").pop()}
                </span>
              )}
            </div>
          </div>

          {isEdit && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">Comments</label>
              <CommentSection
                taskId={currentTaskId}
                comments={comments}
                onAdded={(updatedTask) => {
                  setComments(updatedTask.comments || []);
                  setCurrentTaskId(updatedTask._id);
                  onUpdated(updatedTask);
                }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border-soft p-4">
          {isEdit ? (
            <button
              type="button"
              onClick={() => onDeleteRequest(task)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-red hover:bg-red/10"
            >
              <IconTrash /> Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-3.5 py-2 text-sm text-text hover:bg-surface-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber px-4 py-2 text-sm font-display font-semibold text-bg hover:bg-amber-dim disabled:opacity-60"
            >
              {busy && <IconLoader />}
              {uploading ? "Uploading…" : isEdit ? "Save changes" : "Create task"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
