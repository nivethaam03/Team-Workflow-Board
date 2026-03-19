import { Search, SortAsc, SortDesc, ListFilter } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import type { Status, Priority, SortField } from "../../types";
import { cn } from "../../lib/utils";

const ALL_STATUSES: Status[] = ["Backlog", "In Progress", "Done"];
const ALL_PRIORITIES: (Priority | "All")[] = ["All", "Low", "Medium", "High"];

export const BoardFilters = () => {
  const { filters, sort, setFilters, setSort } = useApp();

  const toggleStatus = (status: Status) => {
    const nextStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    setFilters({ status: nextStatus });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Search */}
        <div className="md:col-span-4 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search..."
            className="pl-9 h-9 border-border focus:border-primary bg-background text-sm"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>

        {/* Priority Filter */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 pl-1">
            Priority
          </label>
          <Select
            className="h-9 border-border bg-background text-sm"
            value={filters.priority}
            onChange={(e) => setFilters({ priority: e.target.value as Priority | "All" })}
            options={ALL_PRIORITIES.map((p) => ({ label: p, value: p }))}
          />
        </div>

        {/* Sorting */}
        <div className="md:col-span-5 flex gap-2">
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 pl-1">
              Sort
            </label>
            <Select
              className="h-9 border-border bg-background text-sm"
              value={sort.field}
              onChange={(e) => setSort({ field: e.target.value as SortField })}
              options={[
                { label: "Created", value: "createdAt" },
                { label: "Updated", value: "updatedAt" },
                { label: "Priority", value: "priority" },
              ]}
            />
          </div>
          <div className="pt-5">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-border bg-background"
              onClick={() => setSort({ order: sort.order === "asc" ? "desc" : "asc" })}
            >
              {sort.order === "asc" ? <SortAsc className="h-3.5 w-3.5" /> : <SortDesc className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Status Multi-select */}
      <div className="pt-3 border-t border-border flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 mr-2">
          <ListFilter className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-semibold text-muted-foreground">Columns:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ALL_STATUSES.map((status) => {
            const isActive = filters.status.includes(status);
            return (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted text-muted-foreground border-border hover:border-primary/40"
                )}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
