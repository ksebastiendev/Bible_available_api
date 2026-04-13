import { BibleBook } from "@/lib/types/bible";
import { Select } from "@/components/common/Select";

interface BookSelectorProps {
  books: BibleBook[];
  value: string;
  onChange: (value: string) => void;
}

export function BookSelector({ books, value, onChange }: BookSelectorProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-[var(--ink-700)]" htmlFor="book">
        Book
      </label>
      <Select id="book" value={value} onChange={(event) => onChange(event.target.value)}>
        {books.map((book) => (
          <option key={book.slug} value={book.slug}>
            {book.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
