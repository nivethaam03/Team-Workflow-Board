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
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        {/* Search */}
        <div className="md:col-span-4 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search tasks..."
            className="pl-9 h-11 border-gray-200 focus:border-primary"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>

        {/* Priority Filter */}
        <div className="md:col-span-3 space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 pl-1">
            Priority Filter
          </label>
          <Select
            className="h-11 border-gray-200"
            value={filters.priority}
            onChange={(e) => setFilters({ priority: e.target.value as Priority | "All" })}
            options={ALL_PRIORITIES.map((p) => ({ label: p, value: p }))}
          />
        </div>

        {/* Sorting */}
        <div className="md:col-span-5 flex gap-2">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 pl-1">
              Sort By
            </label>
            <Select
              className="h-11 border-gray-200"
              value={sort.field}
              onChange={(e) => setSort({ field: e.target.value as SortField })}
              options={[
                { label: "Created Date", value: "createdAt" },
                { label: "Updated Date", value: "updatedAt" },
                { label: "Priority Level", value: "priority" },
              ]}
            />
          </div>
          <div className="pt-6">
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 border-gray-200"
              onClick={() => setSort({ order: sort.order === "asc" ? "desc" : "asc" })}
            >
              {sort.order === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Status Multi-select */}
      <div className="pt-4 border-t flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 mr-4">
          <ListFilter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-gray-600">Columns:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map((status) => {
            const isActive = filters.status.includes(status);
            return (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300"
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
