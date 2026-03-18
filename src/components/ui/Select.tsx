import * as React from "react";
import { cn } from "../../lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: { label: string; value: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <select
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs font-medium text-destructive">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
