import type { SelectHTMLAttributes } from "react";

export function Select({ label, options, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[] }) {
  return <label className="grid gap-1.5 text-sm font-medium"><span>{label}</span><select className="min-h-10 rounded-md border bg-surface px-3 text-sm" {...props}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}
