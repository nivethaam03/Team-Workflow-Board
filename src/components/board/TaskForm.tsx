import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Task, Status } from "../../types";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/TextArea";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { X, Plus, User, FileText, Tag as TagIcon, LayoutPanelLeft } from "lucide-react";

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["Backlog", "In Progress", "Done"]),
  priority: z.enum(["Low", "Medium", "High"]),
  assignee: z.string().min(2, "Assignee name is required"),
  tags: z.array(z.string()),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Task;
  defaultStatus?: Status;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isDirty?: (dirty: boolean) => void;
}

export const TaskForm = ({ initialData, defaultStatus, onSubmit, onCancel, isDirty }: TaskFormProps) => {
  const [tagInput, setTagInput] = React.useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty: formIsDirty },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      status: defaultStatus || "Backlog",
      priority: "Medium",
      assignee: "",
      tags: [],
    },
  });

  // Sync dirty state with parent for "unsaved changes" warning
  React.useEffect(() => {
    isDirty?.(formIsDirty);
  }, [formIsDirty, isDirty]);

  const tags = watch("tags");

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setValue("tags", [...tags, trimmed], { shouldDirty: true });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue("tags", tags.filter((t) => t !== tagToRemove), { shouldDirty: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-in fade-in duration-300">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold flex items-center gap-2 text-foreground uppercase tracking-widest">
            <LayoutPanelLeft className="h-3.5 w-3.5 text-primary" /> Title
          </label>
          <Input
            {...register("title")}
            placeholder="e.g. Redesign Landing Page"
            error={errors.title?.message}
            className="h-9 text-sm font-medium bg-background"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold flex items-center gap-2 text-foreground uppercase tracking-widest">
            <FileText className="h-3.5 w-3.5 text-primary" /> Description
          </label>
          <Textarea
            {...register("description")}
            placeholder="Provide a detailed description..."
            error={errors.description?.message}
            className="min-h-[100px] text-xs leading-relaxed bg-background"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-foreground uppercase tracking-widest">Status</label>
            <Select
              {...register("status")}
              options={[
                { label: "Backlog", value: "Backlog" },
                { label: "In Progress", value: "In Progress" },
                { label: "Done", value: "Done" },
              ]}
              className="h-8 bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-foreground uppercase tracking-widest">Priority</label>
            <Select
              {...register("priority")}
              options={[
                { label: "Low", value: "Low" },
                { label: "Medium", value: "Medium" },
                { label: "High", value: "High" },
              ]}
              className="h-8 bg-background"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold flex items-center gap-2 text-foreground uppercase tracking-widest">
            <User className="h-3.5 w-3.5 text-primary" /> Assignee
          </label>
          <Input
            {...register("assignee")}
            placeholder="Assign to..."
            error={errors.assignee?.message}
            className="h-8 bg-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold flex items-center gap-2 text-foreground uppercase tracking-widest">
            <TagIcon className="h-3.5 w-3.5 text-primary" /> Tags
          </label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add tag..."
              className="h-8 bg-background"
            />
            <Button type="button" variant="outline" onClick={addTag} className="h-8 px-3 text-[10px]">
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-0.5 gap-1 border-primary/20 bg-primary/10 text-primary font-bold text-[9px]">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="p-0.5 hover:bg-primary/20 rounded-full transition-colors"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border mt-6">
        <Button type="button" variant="ghost" onClick={onCancel} className="px-4 h-8 font-bold text-[10px]">
          Cancel
        </Button>
        <Button type="submit" className="px-6 h-8 font-bold text-[10px] shadow-md shadow-primary/10">
          {initialData ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};