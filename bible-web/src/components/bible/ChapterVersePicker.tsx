import { Input } from "@/components/common/Input";

interface ChapterVersePickerProps {
  chapter: string;
  verse: string;
  onChapterChange: (value: string) => void;
  onVerseChange: (value: string) => void;
}

export function ChapterVersePicker({
  chapter,
  verse,
  onChapterChange,
  onVerseChange,
}: ChapterVersePickerProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="space-y-1">
        <label className="text-sm font-medium text-[var(--ink-700)]" htmlFor="chapter">
          Chapter
        </label>
        <Input
          id="chapter"
          type="number"
          min={1}
          value={chapter}
          onChange={(event) => onChapterChange(event.target.value)}
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-[var(--ink-700)]" htmlFor="verse">
          Verse
        </label>
        <Input
          id="verse"
          type="number"
          min={1}
          value={verse}
          onChange={(event) => onVerseChange(event.target.value)}
        />
      </div>
    </div>
  );
}
