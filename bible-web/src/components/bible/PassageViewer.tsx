import { PassageResultPayload } from "@/lib/types/bible";
import { Card } from "@/components/common/Card";

export function PassageViewer({ data }: { data: PassageResultPayload }) {
  const segments = Array.isArray(data.segments) ? data.segments : [];

  return (
    <div className="space-y-4">
      <Card
        title="Passage"
        description={`${data.reference ?? ""} (${data.translationCode ?? ""})`.trim()}
      >
        <div className="space-y-6">
          {segments.map((segment, index) => (
            <article key={`${segment.type}-${index}`} className="space-y-2">
              <h3 className="text-base font-semibold text-[var(--ink-900)]">
                {segment.book?.name ?? "Unknown book"}
              </h3>
              <div className="space-y-1 text-sm leading-7 text-[var(--ink-800)]">
                {segment.verses?.map((line, lineIndex) => (
                  <p key={`${line.chapter}-${line.verse}-${lineIndex}`}>
                    <span className="font-semibold">{line.chapter}:{line.verse}</span> {line.text ?? ""}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
