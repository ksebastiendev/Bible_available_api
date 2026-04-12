import Link from "next/link";
import { Card } from "@/components/common/Card";

const cards = [
  {
    href: "/translations",
    title: "Translations",
    description: "Browse available versions from /v1/translations",
  },
  {
    href: "/books",
    title: "Books",
    description: "List canon books from /v1/bible/books",
  },
  {
    href: "/reference",
    title: "Reference",
    description: "Resolve a verse/chapter from /v1/bible/ref",
  },
  {
    href: "/passage",
    title: "Passage",
    description: "Load challenge-style passages via /v1/bible/passage",
  },
  {
    href: "/search",
    title: "Search",
    description: "Query text matches with /v1/bible/search",
  },
];

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="inline-flex rounded-full border border-[var(--ink-300)] bg-[var(--paper-100)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-700)]">
          Bible Web
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-[var(--ink-900)] md:text-5xl">
          Frontend workspace for your NestJS Bible API
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--ink-700)]">
          This web app is isolated in bible-web and consumes existing backend endpoints without
          changing backend business logic.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Card key={card.href} title={card.title} description={card.description}>
            <Link
              href={card.href}
              className="inline-flex rounded-md bg-[var(--ink-900)] px-4 py-2 text-sm font-semibold !text-white transition hover:bg-[var(--ink-700)] active:bg-[var(--ink-800)] active:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-300)]"
              style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
            >
              Open {card.title}
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
