import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: ReactNode;
}

const variantStyles = {
  primary:
    "bg-brand text-white shadow-sm hover:bg-brand-hover active:bg-brand-active focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
  secondary:
    "border border-brand bg-surface text-brand hover:bg-brand-soft active:bg-brand-soft/80 focus-visible:ring-2 focus-visible:ring-brand",
  outline:
    "border border-brand/30 bg-transparent text-brand hover:bg-brand-soft focus-visible:ring-2 focus-visible:ring-brand",
  ghost:
    "text-text-secondary hover:bg-surface-muted hover:text-text-primary focus-visible:ring-2 focus-visible:ring-brand",
  destructive:
    "bg-danger text-white hover:bg-danger/90 focus-visible:ring-2 focus-visible:ring-danger",
};

const sizeStyles = {
  sm: "h-8 px-3 text-xs rounded-full",
  md: "h-10 px-4 text-sm rounded-full",
  lg: "h-12 px-6 text-base rounded-full font-semibold",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  icon,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 outline-none select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-current shrink-0" />
      ) : icon ? (
        <span className="mr-2 shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
}
