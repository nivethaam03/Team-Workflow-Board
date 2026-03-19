import { useEffect, useRef } from "react";
import type { Status, Priority, SortField, SortOrder } from "../types";
import { useApp } from "../context/AppContext";

export function useSyncUrlParams() {
  const { filters, sort, setFilters, setSort } = useApp();
  const isFirstRender = useRef(true);

  // Sync state FROM URL on first render
  useEffect(() => {
    if (isFirstRender.current) {
      const params = new URLSearchParams(window.location.search);
      
      const statusParam = params.get("status");
      if (statusParam) {
        setFilters({ status: statusParam.split(",") as Status[] });
      }

      const priorityParam = params.get("priority");
      if (priorityParam) {
        setFilters({ priority: priorityParam as Priority | "All" });
      }

      const searchParam = params.get("search");
      if (searchParam) {
        setFilters({ search: searchParam });
      }

      const sortFieldParam = params.get("sortField");
      const sortOrderParam = params.get("sortOrder");
      if (sortFieldParam && sortOrderParam) {
        setSort({ field: sortFieldParam as SortField, order: sortOrderParam as SortOrder });
      }

      isFirstRender.current = false;
    }
  }, [setFilters, setSort]);

  // Sync state TO URL on state changes
  useEffect(() => {
    if (!isFirstRender.current) {
      const params = new URLSearchParams();
      
      if (filters.status.length < 3) {
        params.set("status", filters.status.join(","));
      }
      
      if (filters.priority !== "All") {
        params.set("priority", filters.priority);
      }
      
      if (filters.search) {
        params.set("search", filters.search);
      }
      
      params.set("sortField", sort.field);
      params.set("sortOrder", sort.order);
      
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, "", newUrl);
    }
  }, [filters, sort]);
}
