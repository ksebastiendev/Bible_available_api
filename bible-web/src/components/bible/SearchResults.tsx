import { SearchResultPayload } from "@/lib/types/bible";
import { Card } from "@/components/common/Card";

export function SearchResults({ data }: { data: SearchResultPayload }) {
  return (
    <Card
      title="Search results"
      description={`${data.total} result(s), page ${data.page}, limit ${data.limit}`}
    >
      <div className="space-y-4">
        {data.results.map((result) => (
          <article
            key={`${result.bookSlug}-${result.chapter}-${result.verse}-${result.text.slice(0, 20)}`}
            className="rounded-lg border border-[var(--ink-200)] bg-[var(--paper-50)] p-3"
          >
            <h3 className="text-sm font-semibold text-[var(--ink-900)]">
              {result.bookName} {result.chapter}:{result.verse}
            </h3>
            <p className="mt-1 text-sm leading-7 text-[var(--ink-800)]">{result.text}</p>
          </article>
        ))}
      </div>
    </Card>
  );
}
