export default function ConfirmDialog({ title, message, confirmLabel = "Confirm", danger, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm animate-fade-in-up rounded-2xl border border-border bg-surface p-5 shadow-2xl">
        <h3 className="font-display font-semibold text-text mb-1.5">{title}</h3>
        <p className="text-sm text-text-muted mb-5">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-border px-3.5 py-2 text-sm text-text hover:bg-surface-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-lg px-3.5 py-2 text-sm font-semibold ${
              danger ? "bg-red text-white hover:bg-red/90" : "bg-amber text-bg hover:bg-amber-dim"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
