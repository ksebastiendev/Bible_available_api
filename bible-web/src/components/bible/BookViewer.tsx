import { BookResultPayload } from "@/lib/types/bible";
import { Card } from "@/components/common/Card";

export function BookViewer({ data }: { data: BookResultPayload }) {
  const chapters = Array.isArray(data.chapters) ? data.chapters : [];
  const bookName = data.book?.name ?? "Unknown book";

  return (
    <Card
      title={bookName}
      description={`${chapters.length} chapter${chapters.length > 1 ? "s" : ""} • ${data.translationCode ?? ""}`.trim()}
    >
      <div className="space-y-6">
        {chapters.map((chapterItem) => (
          <article key={chapterItem.chapter} className="space-y-3 border-t border-[var(--ink-200)] pt-4 first:border-t-0 first:pt-0">
            <h3 className="text-base font-semibold text-[var(--ink-900)]">Chapter {chapterItem.chapter}</h3>
            <div className="space-y-1 text-sm leading-7 text-[var(--ink-800)]">
              {chapterItem.verses.map((verse) => (
                <p key={`${chapterItem.chapter}-${verse.verse}`}>
                  <span className="font-semibold">{chapterItem.chapter}:{verse.verse}</span> {verse.text ?? ""}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
