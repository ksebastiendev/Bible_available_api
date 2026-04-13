export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="rounded-md border border-[var(--ink-200)] bg-[var(--paper-100)] p-4 text-sm text-[var(--ink-700)]">
      {label}
    </div>
  );
}
