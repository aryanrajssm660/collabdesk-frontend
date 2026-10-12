import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import AppShell from "../components/AppShell";
import UpgradeModal from "../components/UpgradeModal";
import { IconBoard, IconCrown, IconLoader, IconPlus } from "../components/Icons";

function WorkspaceCard({ workspace, onOpen }) {
  const memberCount = workspace.members?.length || 1;
  return (
    <button
      onClick={() => onOpen(workspace)}
      className="group flex flex-col items-start rounded-xl border border-border bg-surface-2 p-5 text-left transition hover:border-amber/40 hover:bg-surface-3"
    >
      <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10 text-amber">
        <IconBoard />
      </span>
      <h3 className="font-display font-semibold text-text mb-1 truncate w-full">{workspace.name}</h3>
      <p className="text-xs text-text-muted">
        {memberCount} member{memberCount === 1 ? "" : "s"} · created{" "}
        {new Date(workspace.createdAt).toLocaleDateString()}
      </p>
    </button>
  );
}

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { user, isPremium } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const fetchWorkspaces = async () => {
    try {
      const res = await api.get("/workspaces");
      setWorkspaces(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't load workspaces"));
    }
  };

  useEffect(() => {
    fetchWorkspaces().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await api.post("/workspaces", { name });
      setWorkspaces((w) => [res.data, ...w]);
      setName("");
      toast.success("Workspace created");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't create workspace"));
    } finally {
      setCreating(false);
    }
  };

  return (
    <AppShell onUpgradeClick={() => setShowUpgrade(true)}>
      <div className="mb-7 flex flex-col gap-1">
        <h1 className="font-display text-2xl font-semibold text-text">
          Welcome, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-sm text-text-muted">Pick a workspace or start a new one.</p>
      </div>

      {!isPremium && (
        <button
          onClick={() => setShowUpgrade(true)}
          className="mb-6 flex w-full items-center justify-between gap-3 rounded-xl border border-amber/25 bg-amber/5 px-4 py-3.5 text-left transition hover:bg-amber/10 sm:px-5"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber/15 text-amber">
              <IconCrown />
            </span>
            <div>
              <p className="text-sm font-medium text-text">You're on the free plan</p>
              <p className="text-xs text-text-muted">Upgrade for unlimited AI subtasks and priority sync</p>
            </div>
          </div>
          <span className="hidden shrink-0 rounded-lg bg-amber px-3 py-1.5 text-xs font-display font-semibold text-bg sm:block">
            Upgrade
          </span>
        </button>
      )}

      <form
        onSubmit={handleCreate}
        className="mb-8 flex flex-col gap-2.5 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:p-5"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name a new workspace…"
          className="flex-1 rounded-lg border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-amber/50"
        />
        <button
          type="submit"
          disabled={creating}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber px-4 py-2.5 text-sm font-display font-semibold text-bg transition hover:bg-amber-dim disabled:opacity-60"
        >
          {creating ? <IconLoader /> : <IconPlus />}
          Create workspace
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-16 text-amber">
          <IconLoader className="text-2xl" />
        </div>
      ) : workspaces.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <p className="font-display text-text mb-1">No workspaces yet</p>
          <p className="text-sm text-text-muted">Create one above to start your first board.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((ws) => (
            <WorkspaceCard
              key={ws._id}
              workspace={ws}
              onOpen={(w) => navigate(`/workspace/${w._id}`, { state: { workspaceName: w.name } })}
            />
          ))}
        </div>
      )}

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </AppShell>
  );
}
