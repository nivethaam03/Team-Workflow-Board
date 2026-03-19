import * as React from "react";
import { Plus, CheckCircle2, RefreshCw, LayoutGrid, LogOut } from "lucide-react";
import { useApp } from "./context/AppContext";
import { useSyncUrlParams } from "./hooks/useSyncUrlParams";
import { TaskBoard } from "./components/board/TaskBoard";
import { BoardFilters } from "./components/board/BoardFilters";
import { TaskForm } from "./components/board/TaskForm";
import { Modal } from "./components/ui/Modal";
import { Button } from "./components/ui/Button";
import { ToastContainer } from "./components/ui/Toast";
import { LoginPage } from "./components/auth/LoginPage";
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
  
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    return localStorage.getItem("is_auth") === "true";
  });
  
  // Sync filters and sort with URL
  useSyncUrlParams();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | undefined>();
  const [defaultStatus, setDefaultStatus] = React.useState<Status>("Backlog");
  const [isFormDirty, setIsFormDirty] = React.useState(false);

  // Show migration toast if needed
  React.useEffect(() => {
    if (isAuthenticated && migrationPerformed) {
      addToast("Data migrated to the latest version successfully!", "info");
      resetMigration();
    }
  }, [isAuthenticated, migrationPerformed, addToast, resetMigration]);

  const handleLogin = (email: string) => {
    setIsAuthenticated(true);
    localStorage.setItem("is_auth", "true");
    localStorage.setItem("user_email", email);
    addToast(`Welcome back, ${email.split('@')[0]}!`, "success");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("is_auth");
    localStorage.removeItem("user_email");
    addToast("Logged out successfully", "info");
  };

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

  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16 text-base">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-md shadow-lg shadow-primary/20">
              <LayoutGrid className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground leading-none">
                Team Workflow
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tasks</span>
              <span className="text-base font-black text-primary leading-none">{tasks.length}</span>
            </div>
            <Button 
              onClick={() => handleOpenCreateModal()} 
              className="h-9 px-4 rounded-md font-bold text-xs shadow-md shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="h-4 w-4 mr-1.5 stroke-[3]" />
              New Task
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-9 w-9 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              title="Logout"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>


      <main className="max-w-[1400px] mx-auto px-6 pt-8 space-y-6">
        {/* Filters Section */}
        <section className="animate-in fade-in slide-in-from-top-2 duration-500">
          <BoardFilters />
        </section>

        {/* Board Section */}
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-card rounded-xl border border-dashed border-border shadow-sm">
              <div className="bg-primary/5 p-4 rounded-full mb-3">
                <LayoutGrid className="h-8 w-8 text-primary opacity-30" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">Ready to start?</h2>
              <p className="text-muted-foreground text-sm max-w-xs text-center mb-6">
                Your board is currently empty.
              </p>
              <Button 
                onClick={() => handleOpenCreateModal()}
                variant="outline"
                className="h-9 px-6 border-border hover:border-primary hover:bg-primary/5 transition-all font-bold text-sm"
              >
                Create Task
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
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-md border border-border rounded-lg px-5 py-2 shadow-xl flex items-center gap-5 z-50">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight">
            Done: {tasks.filter(t => t.status === "Done").length}
          </span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-blue-500" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight">
            Active: {tasks.filter(t => t.status === "In Progress").length}
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