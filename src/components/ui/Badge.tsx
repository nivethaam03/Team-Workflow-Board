import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";
}

const Badge = ({ className, variant = "default", ...props }: BadgeProps) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent",
    outline: "text-foreground border border-input hover:bg-accent",
    success: "bg-emerald-100 text-emerald-800 border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    info: "bg-sky-100 text-sky-800 border-sky-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export { Badge };
