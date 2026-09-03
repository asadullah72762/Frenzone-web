"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

export function FormField({ label, error, id, className = "", type = "text", ...props }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <label className="grid gap-1.5 text-sm font-medium" htmlFor={id}>
      <span>{label}</span>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          className={`bg-surface min-h-10 w-full rounded-md border px-3 text-sm font-normal ${
            isPassword ? "pr-10" : ""
          } ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer p-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        ) : null}
      </div>
      {error ? (
        <span id={`${id}-error`} className="text-danger text-xs font-normal">
          {error}
        </span>
      ) : null}
    </label>
  );
}
