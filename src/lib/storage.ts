import type { Task } from "../types";

const STORAGE_KEY = "team_workflow_board";
const CURRENT_SCHEMA_VERSION = 2; // Incremented for migration demo

export interface StoredData {
  tasks: any[]; // Use any for migration flexibility
  schemaVersion: number;
}

export const loadFromStorage = (): { tasks: Task[]; migrationPerformed: boolean } => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { tasks: [], migrationPerformed: false };

    let data: StoredData = JSON.parse(raw);
    let migrationPerformed = false;

    // Simulate Migration
    if (data.schemaVersion < CURRENT_SCHEMA_VERSION) {
      console.log(`Migrating from v${data.schemaVersion} to v${CURRENT_SCHEMA_VERSION}`);
      
      // Example: add tags if missing, or update date format
      data.tasks = data.tasks.map(task => ({
        ...task,
        tags: task.tags || [], // Ensure tags exist
        assignee: task.assignee || "Unassigned"
      }));
      
      data.schemaVersion = CURRENT_SCHEMA_VERSION;
      migrationPerformed = true;
      saveToStorage(data.tasks);
    }

    return { tasks: data.tasks as Task[], migrationPerformed };
  } catch (err) {
    console.error("Failed to load from storage", err);
    return { tasks: [], migrationPerformed: false };
  }
};

export const saveToStorage = (tasks: Task[]) => {
  try {
    const data: StoredData = {
      tasks,
      schemaVersion: CURRENT_SCHEMA_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save to storage", err);
  }
};
