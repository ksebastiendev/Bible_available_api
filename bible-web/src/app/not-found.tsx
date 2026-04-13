import Link from "next/link";

export default function NotFound() {
  return (
    <section className="space-y-4 rounded-xl border border-[var(--ink-200)] bg-[var(--paper-100)] p-6">
      <h1 className="text-2xl font-semibold text-[var(--ink-900)]">Page not found</h1>
      <p className="text-sm text-[var(--ink-700)]">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="inline-flex rounded-md bg-[var(--ink-900)] px-4 py-2 text-sm font-semibold text-white active:bg-[var(--ink-800)] active:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-300)]"
      >
        Go back home
      </Link>
    </section>
  );
}
