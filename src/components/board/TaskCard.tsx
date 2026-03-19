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
      <Card className="task-card mb-2 group">
        <CardContent className="p-2.5 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-foreground line-clamp-2 leading-tight text-xs">
              {task.title}
            </h4>
            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onEdit(task)}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive hover:text-destructive"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground line-clamp-2">
            {task.description}
          </p>

          <div className="flex flex-wrap gap-1">
            <Badge variant={priorityVariants[task.priority]} className="h-4.5">{task.priority}</Badge>
            {task.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-primary/20 h-4.5">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="pt-1.5 border-t border-border flex items-center justify-between text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
            <div className="flex items-center gap-1">
              <User className="h-2.5 w-2.5" />
              <span>{task.assignee.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-2.5 w-2.5" />
              <span>{formatDistanceToNow(new Date(task.updatedAt), { addSuffix: false })}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};