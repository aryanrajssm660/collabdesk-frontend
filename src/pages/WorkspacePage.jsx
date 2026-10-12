import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api, { getErrorMessage } from "../lib/api";
import { getSocket } from "../lib/socket";
import { useToast } from "../context/ToastContext";
import AppShell from "../components/AppShell";
import ListColumn from "../components/ListColumn";
import TaskModal from "../components/TaskModal";
import UpgradeModal from "../components/UpgradeModal";
import ConfirmDialog from "../components/ConfirmDialog";
import { IconChevronLeft, IconLoader, IconPlus } from "../components/Icons";

function codePrefix(name = "") {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "CD";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function WorkspacePage() {
  const { workspaceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [workspaceName, setWorkspaceName] = useState(location.state?.workspaceName || "");
  const [members, setMembers] = useState([]);
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { mode: 'create' | 'edit', task?, defaultListId? }
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [listToDelete, setListToDelete] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [addingList, setAddingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [draggedListId, setDraggedListId] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      const [listsRes, tasksRes] = await Promise.all([
        api.get(`/lists/workspace/${workspaceId}`),
        api.get(`/tasks/workspace/${workspaceId}`),
      ]);
      setLists(listsRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't load board"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  useEffect(() => {
    api
      .get(`/workspaces/${workspaceId}`)
      .then((res) => {
        setWorkspaceName(res.data.name);
        setMembers(res.data.members || []);
      })
      .catch(() => {});
  }, [workspaceId]);

  useEffect(() => {
    setLoading(true);
    fetchAll().finally(() => setLoading(false));
  }, [fetchAll]);

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    const sameWorkspace = (entity) => entity.workspace === workspaceId;

    const onTaskUpdated = (task) => {
      if (!sameWorkspace(task)) return;
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    };
    const onTaskCreated = (task) => {
      if (!sameWorkspace(task)) return;
      setTasks((prev) => (prev.some((t) => t._id === task._id) ? prev : [...prev, task]));
    };
    const onTaskDeleted = (payload) => {
      setTasks((prev) => prev.filter((t) => t._id !== payload._id));
    };
    const onTasksReordered = () => {
      fetchAll();
    };
    const onListCreated = (list) => {
      if (!sameWorkspace(list)) return;
      setLists((prev) => (prev.some((l) => l._id === list._id) ? prev : [...prev, list]));
    };
    const onListUpdated = (list) => {
      setLists((prev) => prev.map((l) => (l._id === list._id ? list : l)));
    };
    const onListDeleted = (payload) => {
      setLists((prev) => prev.filter((l) => l._id !== payload._id));
    };
    const onListsReordered = () => {
      fetchAll();
    };

    socket.on("taskUpdated", onTaskUpdated);
    socket.on("taskCreated", onTaskCreated);
    socket.on("taskDeleted", onTaskDeleted);
    socket.on("tasksReordered", onTasksReordered);
    socket.on("listCreated", onListCreated);
    socket.on("listUpdated", onListUpdated);
    socket.on("listDeleted", onListDeleted);
    socket.on("listsReordered", onListsReordered);

    return () => {
      socket.off("taskUpdated", onTaskUpdated);
      socket.off("taskCreated", onTaskCreated);
      socket.off("taskDeleted", onTaskDeleted);
      socket.off("tasksReordered", onTasksReordered);
      socket.off("listCreated", onListCreated);
      socket.off("listUpdated", onListUpdated);
      socket.off("listDeleted", onListDeleted);
      socket.off("listsReordered", onListsReordered);
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, fetchAll]);

  const prefix = useMemo(() => codePrefix(workspaceName), [workspaceName]);

  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [tasks]
  );

  const codeFor = useCallback(
    (taskId) => {
      const idx = sortedTasks.findIndex((t) => t._id === taskId);
      return `${prefix}-${String(idx + 1).padStart(3, "0")}`;
    },
    [sortedTasks, prefix]
  );

  const sortedLists = useMemo(() => [...lists].sort((a, b) => a.position - b.position), [lists]);

  const tasksForList = useCallback(
    (listId) =>
      tasks
        .filter((t) => t.list === listId)
        .sort((a, b) => a.position - b.position),
    [tasks]
  );

  const handleDropTask = async (destListId, destIndex, taskId) => {
    const movedTask = tasks.find((t) => t._id === taskId);
    if (!movedTask) return;

    const destTasksExcludingMoved = tasksForList(destListId).filter((t) => t._id !== taskId);
    const newOrder = [...destTasksExcludingMoved];
    newOrder.splice(destIndex, 0, { ...movedTask, list: destListId });

    const updates = newOrder.map((t, idx) => ({ _id: t._id, list: destListId, position: idx }));

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => {
        const u = updates.find((up) => up._id === t._id);
        return u ? { ...t, list: u.list, position: u.position } : t;
      })
    );

    try {
      await api.put("/tasks/reorder/bulk", { updates });
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't move task"));
      fetchAll();
    }
  };

  const handleListDrop = async (targetList) => {
    if (!draggedListId || draggedListId === targetList._id) {
      setDraggedListId(null);
      return;
    }
    const current = sortedLists.filter((l) => l._id !== draggedListId);
    const draggedList = sortedLists.find((l) => l._id === draggedListId);
    const targetIdx = current.findIndex((l) => l._id === targetList._id);
    current.splice(targetIdx, 0, draggedList);

    const updates = current.map((l, idx) => ({ _id: l._id, position: idx }));
    setLists((prev) =>
      prev.map((l) => {
        const u = updates.find((up) => up._id === l._id);
        return u ? { ...l, position: u.position } : l;
      })
    );
    setDraggedListId(null);

    try {
      await api.put("/lists/reorder", { updates });
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't reorder lists"));
      fetchAll();
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    try {
      const res = await api.post("/lists", { name: newListName.trim(), workspace: workspaceId });
      setLists((prev) => (prev.some((l) => l._id === res.data._id) ? prev : [...prev, res.data]));
      setNewListName("");
      setAddingList(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't create list"));
    }
  };

  const handleRenameList = async (list, name) => {
    setLists((prev) => prev.map((l) => (l._id === list._id ? { ...l, name } : l)));
    try {
      await api.put(`/lists/${list._id}`, { name });
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't rename list"));
      fetchAll();
    }
  };

  const handleDeleteList = async () => {
    if (!listToDelete) return;
    try {
      await api.delete(`/lists/${listToDelete._id}`);
      setLists((prev) => prev.filter((l) => l._id !== listToDelete._id));
      setTasks((prev) => prev.filter((t) => t.list !== listToDelete._id));
      toast.success("List deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't delete list"));
    } finally {
      setListToDelete(null);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await api.delete(`/tasks/${taskToDelete._id}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
      toast.success("Task deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't delete task"));
    } finally {
      setTaskToDelete(null);
      setModal(null);
    }
  };

  return (
    <AppShell onUpgradeClick={() => setShowUpgrade(true)}>
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 inline-flex items-center gap-1 text-sm text-text-muted hover:text-text"
      >
        <IconChevronLeft /> Dashboard
      </button>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text truncate">
            {workspaceName || "Task board"}
          </h1>
          <p className="font-mono text-xs text-text-faint mt-0.5">{prefix} · {tasks.length} tasks</p>
        </div>
        <button
          onClick={() => setModal({ mode: "create", defaultListId: sortedLists[0]?._id })}
          disabled={sortedLists.length === 0}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber px-4 py-2.5 text-sm font-display font-semibold text-bg transition hover:bg-amber-dim disabled:opacity-50"
        >
          <IconPlus /> Add task
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-amber">
          <IconLoader className="text-2xl" />
        </div>
      ) : (
        <div className="flex items-start gap-4 overflow-x-auto pb-4">
          {sortedLists.map((list) => (
            <ListColumn
              key={list._id}
              list={list}
              tasks={tasksForList(list._id)}
              members={members}
              codeFor={codeFor}
              onOpenTask={(t) => setModal({ mode: "edit", task: t })}
              onDeleteTask={(t) => setTaskToDelete(t)}
              onAddTask={(listId) => setModal({ mode: "create", defaultListId: listId })}
              onRenameList={handleRenameList}
              onDeleteList={(l) => setListToDelete(l)}
              onDropTask={handleDropTask}
              onListDragStart={(l) => setDraggedListId(l._id)}
              onListDrop={handleListDrop}
              isListDragTarget={false}
            />
          ))}

          <div className="w-[280px] shrink-0">
            {addingList ? (
              <form
                onSubmit={handleCreateList}
                className="rounded-xl border border-amber/40 bg-surface p-3"
              >
                <input
                  autoFocus
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onBlur={() => {
                    if (!newListName.trim()) setAddingList(false);
                  }}
                  placeholder="List name"
                  className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-amber/50"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-amber px-3 py-1.5 text-xs font-semibold text-bg hover:bg-amber-dim"
                  >
                    Add list
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddingList(false);
                      setNewListName("");
                    }}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs text-text hover:bg-surface-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setAddingList(true)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border px-3 py-3.5 text-sm text-text-muted hover:border-amber/50 hover:text-amber"
              >
                <IconPlus /> Add list
              </button>
            )}
          </div>
        </div>
      )}

      {modal && (
        <TaskModal
          mode={modal.mode}
          task={modal.task}
          code={modal.task ? codeFor(modal.task._id) : null}
          workspaceId={workspaceId}
          members={members}
          lists={sortedLists}
          defaultListId={modal.defaultListId}
          onClose={() => setModal(null)}
          onCreated={(task) => setTasks((prev) => [...prev, task])}
          onUpdated={(task) => setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)))}
          onDeleteRequest={(task) => setTaskToDelete(task)}
        />
      )}

      {taskToDelete && (
        <ConfirmDialog
          title="Delete this task?"
          message={`"${taskToDelete.title}" will be removed for everyone in this workspace.`}
          confirmLabel="Delete"
          danger
          onCancel={() => setTaskToDelete(null)}
          onConfirm={handleDeleteTask}
        />
      )}

      {listToDelete && (
        <ConfirmDialog
          title="Delete this list?"
          message={`"${listToDelete.name}" and all ${tasksForList(listToDelete._id).length} task(s) in it will be deleted for everyone.`}
          confirmLabel="Delete"
          danger
          onCancel={() => setListToDelete(null)}
          onConfirm={handleDeleteList}
        />
      )}

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </AppShell>
  );
}
