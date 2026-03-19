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
  Backlog: "bg-gray-400",
  "In Progress": "bg-blue-500",
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
      <div className="flex flex-col md:flex-row gap-8 items-start overflow-x-auto pb-6 scrollbar-hide">
        {COLUMNS.map((column) => (
          <div key={column} className="flex-1 min-w-[320px] w-full flex flex-col gap-5">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className={cn("h-2.5 w-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]", statusColors[column])} />
                <h3 className="font-bold text-[13px] text-gray-800 uppercase tracking-widest">
                  {column}
                </h3>
                <span className="bg-white border border-gray-100 px-2.5 py-0.5 rounded-lg text-[11px] font-black text-gray-400 shadow-sm">
                  {filteredAndSortedTasks.filter((t) => t.status === column).length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:bg-white hover:text-primary rounded-xl transition-all shadow-sm"
                onClick={() => onAddTask(column)}
              >
                <Plus className="h-4 w-4 stroke-[3]" />
              </Button>
            </div>

            <Droppable droppableId={column}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "board-column transition-all duration-300",
                    snapshot.isDraggingOver && "bg-blue-50/40 border-primary/20 ring-4 ring-primary/5"
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
                      <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200/50 rounded-2xl bg-gray-50/30">
                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
                          <Circle className="h-5 w-5 text-gray-200" />
                        </div>
                        <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">
                          Empty Column
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
