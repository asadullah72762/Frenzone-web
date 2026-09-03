import type { TextareaHTMLAttributes } from "react";

export function Textarea({ label, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) { return <label className="grid gap-1.5 text-sm font-medium"><span>{label}</span><textarea className="min-h-24 rounded-md border bg-surface p-3 text-sm" {...props} /></label>; }
