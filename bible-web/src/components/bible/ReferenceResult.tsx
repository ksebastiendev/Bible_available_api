import { ReferenceResultPayload } from "@/lib/types/bible";
import { Card } from "@/components/common/Card";

export function ReferenceResult({ data }: { data: ReferenceResultPayload }) {
  const hasVerseList = Array.isArray(data.verses) && data.verses.length > 0;

  return (
    <Card
      title="Reference result"
      description={`${data.reference ?? ""} (${data.translationCode ?? ""})`.trim()}
    >
      {hasVerseList ? (
        <div className="space-y-1 text-sm leading-7 text-[var(--ink-800)]">
          {data.verses?.map((line, index) => (
            <p key={`${line.chapter}-${line.verse}-${index}`}>
              <span className="font-semibold">{line.verse}</span> {line.text ?? ""}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-sm leading-7 text-[var(--ink-800)]">{data.text ?? "No text returned."}</p>
      )}
    </Card>
  );
}
