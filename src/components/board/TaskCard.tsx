import { formatDistanceToNow } from "date-fns";
import { Calendar, User, Edit2, Trash2 } from "lucide-react";
import type { Task, Priority } from "../../types";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  provided?: any; // For drag and drop
}

const priorityVariants: Record<Priority, "success" | "warning" | "destructive"> = {
  Low: "success",
  Medium: "warning",
  High: "destructive",
};

export const TaskCard = ({ task, onEdit, onDelete, provided }: TaskCardProps) => {
  return (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
    >
      <Card className="task-card mb-3 group">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-foreground line-clamp-2 leading-tight">
              {task.title}
            </h4>
            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(task)}
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3">
            {task.description}
          </p>

          <div className="flex flex-wrap gap-1">
            <Badge variant={priorityVariants[task.priority]}>{task.priority}</Badge>
            {task.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="pt-2 border-t flex items-center justify-between text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <User className="h-3 w-3" />
              <span>{task.assignee}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(task.updatedAt))} ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
