import { ReactNode } from "react";

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export function Card({ title, description, children }: CardProps) {
  return (
    <section className="rounded-xl border border-[var(--ink-200)] bg-[var(--paper-100)] p-5 shadow-[0_10px_30px_-25px_rgba(0,0,0,0.5)]">
      {(title || description) && (
        <header className="mb-4">
          {title ? <h2 className="text-lg font-semibold text-[var(--ink-900)]">{title}</h2> : null}
          {description ? <p className="text-sm text-[var(--ink-600)]">{description}</p> : null}
        </header>
      )}
      {children}
    </section>
  );
}
