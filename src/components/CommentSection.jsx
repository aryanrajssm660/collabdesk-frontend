import { useState } from "react";
import api, { getErrorMessage } from "../lib/api";
import { useToast } from "../context/ToastContext";
import { IconLoader } from "./Icons";

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function CommentSection({ taskId, comments = [], onAdded }) {
  const toast = useToast();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !taskId) return;
    setSending(true);
    try {
      const res = await api.post(`/tasks/${taskId}/comments`, { text });
      onAdded(res.data);
      setText("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't post comment"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="max-h-48 space-y-3 overflow-y-auto pr-1">
        {comments.length === 0 && (
          <p className="text-xs text-text-faint">No comments yet.</p>
        )}
        {comments.map((c, idx) => (
          <div key={idx} className="flex gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-3 border border-border text-[10px] font-medium text-text-muted">
              {c.authorName?.[0]?.toUpperCase() || "?"}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-medium text-text">{c.authorName}</span>
                <span className="text-[10px] text-text-faint">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="text-xs text-text-muted break-words whitespace-pre-line">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="mt-3 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={taskId ? "Write a comment…" : "Save the task first to comment"}
          disabled={!taskId}
          className="min-w-0 flex-1 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-text placeholder:text-text-faint focus:border-amber/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!taskId || sending || !text.trim()}
          className="inline-flex items-center gap-1 rounded-md bg-amber px-3 py-1.5 text-xs font-semibold text-bg hover:bg-amber-dim disabled:opacity-50"
        >
          {sending ? <IconLoader /> : "Post"}
        </button>
      </form>
    </div>
  );
}
