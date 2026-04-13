import { SelectHTMLAttributes } from "react";

export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={[
        "w-full rounded-md border border-[var(--ink-300)] bg-[var(--paper-100)] px-3 py-2 text-sm",
        "text-[var(--ink-900)]",
        "focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-300)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
