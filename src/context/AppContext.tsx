import * as React from "react";
import type { Task, Filters, SortOptions} from "../types";
import { loadFromStorage, saveToStorage } from "../lib/storage";
import { v4 as uuidv4 } from "uuid";

// Toast Types
export type ToastType = "success" | "error" | "info" | "warning";
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

// State Type
interface AppState {
  tasks: Task[];
  filters: Filters;
  sort: SortOptions;
  toasts: Toast[];
  migrationPerformed: boolean;
}

// Action Types
type AppAction =
  | { type: "ADD_TASK"; payload: Omit<Task, "id" | "createdAt" | "updatedAt"> }
  | { type: "UPDATE_TASK"; payload: { id: string; updates: Partial<Task> } }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_FILTERS"; payload: Partial<Filters> }
  | { type: "SET_SORT"; payload: Partial<SortOptions> }
  | { type: "ADD_TOAST"; payload: { message: string; type: ToastType } }
  | { type: "REMOVE_TOAST"; payload: string }
  | { type: "RESET_MIGRATION" };

// Context Interface
interface AppContextType extends AppState {
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setFilters: (filters: Partial<Filters>) => void;
  setSort: (sort: Partial<SortOptions>) => void;
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
  resetMigration: () => void;
}

const initialFilters: Filters = {
  status: ["Backlog", "In Progress", "Done"],
  priority: "All",
  search: "",
};

const initialSort: SortOptions = {
  field: "createdAt",
  order: "desc",
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

const appReducer = (state: AppState, action: AppAction): AppState => {
  let newState: AppState;

  switch (action.type) {
    case "ADD_TASK": {
      const now = new Date().toISOString();
      const newTask: Task = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      const updatedTasks = [newTask, ...state.tasks];
      saveToStorage(updatedTasks);
      newState = { ...state, tasks: updatedTasks };
      break;
    }
    case "UPDATE_TASK": {
      const updatedTasks = state.tasks.map((t) =>
        t.id === action.payload.id 
          ? { ...t, ...action.payload.updates, updatedAt: new Date().toISOString() } 
          : t
      );
      saveToStorage(updatedTasks);
      newState = { ...state, tasks: updatedTasks };
      break;
    }
    case "DELETE_TASK": {
      const updatedTasks = state.tasks.filter((t) => t.id !== action.payload);
      saveToStorage(updatedTasks);
      newState = { ...state, tasks: updatedTasks };
      break;
    }
    case "SET_FILTERS":
      newState = { ...state, filters: { ...state.filters, ...action.payload } };
      break;
    case "SET_SORT":
      newState = { ...state, sort: { ...state.sort, ...action.payload } };
      break;
    case "ADD_TOAST":
      newState = {
        ...state,
        toasts: [...state.toasts, { id: uuidv4(), ...action.payload }],
      };
      break;
    case "REMOVE_TOAST":
      newState = {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };
      break;
    case "RESET_MIGRATION":
      newState = { ...state, migrationPerformed: false };
      break;
    default:
      return state;
  }
  return newState;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tasks, migrationPerformed } = loadFromStorage();

  const [state, dispatch] = React.useReducer(appReducer, {
    tasks,
    filters: initialFilters,
    sort: initialSort,
    toasts: [],
    migrationPerformed,
  });

  const value: AppContextType = {
    ...state,
    addTask: (payload) => dispatch({ type: "ADD_TASK", payload }),
    updateTask: (id, updates) => dispatch({ type: "UPDATE_TASK", payload: { id, updates } }),
    deleteTask: (payload) => dispatch({ type: "DELETE_TASK", payload }),
    setFilters: (payload) => dispatch({ type: "SET_FILTERS", payload }),
    setSort: (payload) => dispatch({ type: "SET_SORT", payload }),
    addToast: (message, type) => dispatch({ type: "ADD_TOAST", payload: { message, type } }),
    removeToast: (payload) => dispatch({ type: "REMOVE_TOAST", payload }),
    resetMigration: () => dispatch({ type: "RESET_MIGRATION" }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = React.useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
