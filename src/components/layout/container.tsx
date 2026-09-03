import type { ReactNode } from "react";
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[var(--content-max)] px-6 md:px-8 lg:px-12 ${className}`}
    >
      {children}
    </div>
  );
}
