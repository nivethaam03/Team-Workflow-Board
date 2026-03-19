import * as React from "react";
import { Plus, CheckCircle2, AlertCircle, RefreshCw, LayoutGrid } from "lucide-react";
import { useApp } from "./context/AppContext";
import { useSyncUrlParams } from "./hooks/useSyncUrlParams";
import { TaskBoard } from "./components/board/TaskBoard";
import { BoardFilters } from "./components/board/BoardFilters";
import { TaskForm } from "./components/board/TaskForm";
import { Modal } from "./components/ui/Modal";
import { Button } from "./components/ui/Button";
import { ToastContainer } from "./components/ui/Toast";
import type { Status, Task } from "./types";

function App() {
  const { 
    tasks, 
    addTask, 
    updateTask, 
    migrationPerformed, 
    resetMigration,
    toasts,
    addToast,
    removeToast
  } = useApp();
  
  // Sync filters and sort with URL
  useSyncUrlParams();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | undefined>();
  const [defaultStatus, setDefaultStatus] = React.useState<Status>("Backlog");
  const [isFormDirty, setIsFormDirty] = React.useState(false);

  // Show migration toast if needed
  React.useEffect(() => {
    if (migrationPerformed) {
      addToast("Data migrated to the latest version successfully!", "info");
      resetMigration();
    }
  }, [migrationPerformed, addToast, resetMigration]);

  const handleOpenCreateModal = (status: Status = "Backlog") => {
    setEditingTask(undefined);
    setDefaultStatus(status);
    setIsModalOpen(true);
    setIsFormDirty(false);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
    setIsFormDirty(false);
  };

  const handleCloseModal = () => {
    if (isFormDirty) {
      const confirm = window.confirm("You have unsaved changes. Are you sure you want to close?");
      if (!confirm) return;
    }
    setIsModalOpen(false);
    setEditingTask(undefined);
    setIsFormDirty(false);
  };

  const handleFormSubmit = (data: any) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      addToast("Task updated successfully!", "success");
    } else {
      addTask(data);
      addToast("New task created!", "success");
    }
    setIsModalOpen(false);
    setEditingTask(undefined);
    setIsFormDirty(false);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-20">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
              <LayoutGrid className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none mb-1">
                Team Workflow Board
              </h1>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                Manage your tasks efficiently
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Tasks</span>
              <span className="text-lg font-black text-primary leading-none">{tasks.length}</span>
            </div>
            <Button 
              onClick={() => handleOpenCreateModal()} 
              className="h-11 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="h-5 w-5 mr-2 stroke-[3]" />
              Create Task
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 pt-10 space-y-10">
        {/* Filters Section */}
        <section className="animate-in fade-in slide-in-from-top-4 duration-700">
          <BoardFilters />
        </section>

        {/* Board Section */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-sm">
              <div className="bg-blue-50 p-6 rounded-full mb-6">
                <LayoutGrid className="h-12 w-12 text-primary opacity-40" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to start?</h2>
              <p className="text-muted-foreground max-w-xs text-center mb-8">
                Your board is currently empty. Create your first task to start tracking your progress.
              </p>
              <Button 
                onClick={() => handleOpenCreateModal()}
                variant="outline"
                className="h-12 px-8 border-gray-200 hover:border-primary hover:bg-blue-50 transition-all font-bold"
              >
                Create My First Task
              </Button>
            </div>
          ) : (
            <TaskBoard 
              onEditTask={handleOpenEditModal} 
              onAddTask={handleOpenCreateModal} 
            />
          )}
        </section>
      </main>

      {/* Footer / Stats */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl px-6 py-3 shadow-2xl flex items-center gap-8 z-50">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">
            Done: {tasks.filter(t => t.status === "Done").length}
          </span>
        </div>
        <div className="w-px h-4 bg-gray-200" />
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-blue-500" />
          <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">
            In Progress: {tasks.filter(t => t.status === "In Progress").length}
          </span>
        </div>
        <div className="w-px h-4 bg-gray-200" />
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">
            Backlog: {tasks.filter(t => t.status === "Backlog").length}
          </span>
        </div>
      </footer>

      {/* Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? "Edit Task Details" : "Create New Task"}
        className="max-w-2xl"
      >
        <TaskForm
          initialData={editingTask}
          defaultStatus={defaultStatus}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          isDirty={setIsFormDirty}
        />
      </Modal>
    </div>
  );
}

export default App;
