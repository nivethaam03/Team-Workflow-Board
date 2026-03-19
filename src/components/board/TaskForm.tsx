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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold flex items-center gap-2 text-gray-700">
            <LayoutPanelLeft className="h-4 w-4 text-primary" /> Title
          </label>
          <Input
            {...register("title")}
            placeholder="e.g. Redesign Landing Page"
            error={errors.title?.message}
            className="h-12 text-lg font-medium"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold flex items-center gap-2 text-gray-700">
            <FileText className="h-4 w-4 text-primary" /> Description
          </label>
          <Textarea
            {...register("description")}
            placeholder="Provide a detailed description of the task..."
            error={errors.description?.message}
            className="min-h-[160px] text-base leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Status</label>
            <Select
              {...register("status")}
              options={[
                { label: "Backlog", value: "Backlog" },
                { label: "In Progress", value: "In Progress" },
                { label: "Done", value: "Done" },
              ]}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Priority</label>
            <Select
              {...register("priority")}
              options={[
                { label: "Low", value: "Low" },
                { label: "Medium", value: "Medium" },
                { label: "High", value: "High" },
              ]}
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold flex items-center gap-2 text-gray-700">
            <User className="h-4 w-4 text-primary" /> Assignee
          </label>
          <Input
            {...register("assignee")}
            placeholder="Assign to..."
            error={errors.assignee?.message}
            className="h-11"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center gap-2 text-gray-700">
            <TagIcon className="h-4 w-4 text-primary" /> Tags
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
              placeholder="Add a tag..."
              className="h-11"
            />
            <Button type="button" variant="outline" onClick={addTag} className="h-11 px-4">
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="pl-3 pr-1 py-1 gap-1 border-blue-100 bg-blue-50 text-blue-700 font-bold">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t mt-8">
        <Button type="button" variant="ghost" onClick={onCancel} className="px-6 h-11 font-bold">
          Cancel
        </Button>
        <Button type="submit" className="px-10 h-11 font-bold shadow-lg shadow-primary/20">
          {initialData ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};
