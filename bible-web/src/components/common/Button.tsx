import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-300)] disabled:cursor-not-allowed disabled:opacity-50";
  const look =
    variant === "primary"
      ? "bg-[var(--ink-900)] text-white hover:bg-[var(--ink-700)] active:bg-[var(--ink-800)] active:text-white focus-visible:text-white"
      : "border border-[var(--ink-300)] bg-[var(--paper-100)] text-[color:var(--ink-900)] hover:bg-[var(--paper-200)] active:bg-[var(--paper-200)] active:text-[color:var(--ink-900)]";

  return <button className={`${base} ${look} ${className}`.trim()} {...props} />;
}
