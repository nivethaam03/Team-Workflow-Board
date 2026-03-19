import * as React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { Plus, Circle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { TaskCard } from "./TaskCard";
import type { Status, Task } from "../../types";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

interface TaskBoardProps {
  onEditTask: (task: Task) => void;
  onAddTask: (status: Status) => void;
}

const COLUMNS: Status[] = ["Backlog", "In Progress", "Done"];

const statusColors: Record<Status, string> = {
  Backlog: "bg-muted-foreground/50",
  "In Progress": "bg-primary",
  Done: "bg-emerald-500",
};

export const TaskBoard = ({ onEditTask, onAddTask }: TaskBoardProps) => {
  const { tasks, updateTask, deleteTask, filters, sort } = useApp();

  const filteredAndSortedTasks = React.useMemo(() => {
    let result = tasks.filter((task) => {
      const matchesStatus = filters.status.includes(task.status);
      const matchesPriority = filters.priority === "All" || task.priority === filters.priority;
      const matchesSearch =
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase());
      return matchesStatus && matchesPriority && matchesSearch;
    });

    result.sort((a, b) => {
      const multiplier = sort.order === "asc" ? 1 : -1;
      if (sort.field === "priority") {
        const priorityMap = { Low: 1, Medium: 2, High: 3 };
        return (priorityMap[a.priority] - priorityMap[b.priority]) * multiplier;
      }
      return (new Date(a[sort.field]).getTime() - new Date(b[sort.field]).getTime()) * multiplier;
    });

    return result;
  }, [tasks, filters, sort]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    updateTask(draggableId, { status: destination.droppableId as Status });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col md:flex-row gap-4 items-start overflow-x-auto pb-4 scrollbar-hide">
        {COLUMNS.map((column) => (
          <div key={column} className="flex-1 min-w-[280px] w-full flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full shadow-lg", statusColors[column])} />
                <h3 className="font-bold text-[11px] text-foreground uppercase tracking-wider">
                  {column}
                </h3>
                <span className="bg-muted border border-border px-1.5 py-0.5 rounded-md text-[9px] font-black text-muted-foreground shadow-sm">
                  {filteredAndSortedTasks.filter((t) => t.status === column).length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:bg-muted hover:text-primary rounded-md transition-all shadow-sm"
                onClick={() => onAddTask(column)}
              >
                <Plus className="h-3 w-3 stroke-[3]" />
              </Button>
            </div>

            <Droppable droppableId={column}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "board-column transition-all duration-300",
                    snapshot.isDraggingOver && "bg-primary/10 border-primary/20 ring-4 ring-primary/5"
                  )}
                >
                  <div className="flex flex-col min-h-[500px]">
                    {filteredAndSortedTasks
                      .filter((task) => task.status === column)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.9 : 1,
                              }}
                            >
                              <TaskCard
                                task={task}
                                onEdit={onEditTask}
                                onDelete={deleteTask}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                    
                    {filteredAndSortedTasks.filter((t) => t.status === column).length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-border rounded-xl bg-muted/10">
                        <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center shadow-sm mb-2">
                          <Circle className="h-4 w-4 text-muted-foreground/20" />
                        </div>
                        <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                          Empty
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

