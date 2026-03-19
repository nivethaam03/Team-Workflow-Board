export type Status = "Backlog" | "In Progress" | "Done";
export type Priority = "Low" | "Medium" | "High";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type SortField = "createdAt" | "updatedAt" | "priority";
export type SortOrder = "asc" | "desc";

export interface Filters {
  status: Status[];
  priority: Priority | "All";
  search: string;
}

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}

export interface AppState {
  tasks: Task[];
  filters: Filters;
  sort: SortOptions;
  schemaVersion: number;
}
