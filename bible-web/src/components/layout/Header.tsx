import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--ink-200)] bg-[color:color-mix(in_oklab,var(--paper-100)_84%,white)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-wide text-[var(--ink-900)]">
            Bible Web
          </Link>
          <p className="text-xs text-[var(--ink-600)]">Powered by bible-api</p>
        </div>
        <Navigation />
      </div>
    </header>
  );
}
