import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/layout/Navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-(--ink-200) bg-[color-mix(in_oklab,var(--paper-100)_84%,white)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-wide text-(--ink-900)">
            <Image
              src="/logo-Bible-available.png"
              alt="Bible Available logo"
              width={28}
              height={28}
              className="rounded-sm"
            />
            <span>Bible Web</span>
          </Link>
          <p className="text-xs text-(--ink-600)">Powered by bible-api</p>
        </div>
        <Navigation />
      </div>
    </header>
  );
}
