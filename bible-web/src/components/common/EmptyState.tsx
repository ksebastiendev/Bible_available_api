export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-[var(--ink-200)] bg-[var(--paper-100)] p-4 text-sm text-[var(--ink-600)]">
      {message}
    </div>
  );
}
