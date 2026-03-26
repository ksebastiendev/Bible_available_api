"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/translations", label: "Translations" },
  { href: "/books", label: "Books" },
  { href: "/reference", label: "Reference" },
  { href: "/passage", label: "Passage" },
  { href: "/search", label: "Search" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => {
        const active = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={[
              "rounded-md px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-300)]",
              active
                ? "bg-[var(--ink-900)] text-white active:bg-[var(--ink-800)] active:text-white"
                : "bg-[var(--paper-100)] text-[color:var(--ink-700)] hover:bg-[var(--paper-200)] active:bg-[var(--ink-300)] active:text-[color:var(--ink-900)]",
            ].join(" ")}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
