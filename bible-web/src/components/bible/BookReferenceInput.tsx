"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/common/Input";
import { BibleBook } from "@/lib/types/bible";

type BookReferenceInputMode = "reference" | "passage";

interface BookReferenceInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  books: BibleBook[];
  placeholder?: string;
  mode: BookReferenceInputMode;
}

type Suggestion = {
  book: BibleBook;
  score: number;
};

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function isSubsequence(query: string, candidate: string): boolean {
  let index = 0;

  for (const character of candidate) {
    if (character === query[index]) {
      index += 1;
    }

    if (index === query.length) {
      return true;
    }
  }

  return query.length === 0;
}

function levenshteinDistance(left: string, right: string): number {
  const rows = left.length + 1;
  const cols = right.length + 1;
  const matrix = Array.from({ length: rows }, () => Array<number>(cols).fill(0));

  for (let row = 0; row < rows; row += 1) {
    matrix[row][0] = row;
  }

  for (let col = 0; col < cols; col += 1) {
    matrix[0][col] = col;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const substitutionCost = left[row - 1] === right[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + substitutionCost,
      );
    }
  }

  return matrix[left.length][right.length];
}

function extractActiveSegment(value: string, mode: BookReferenceInputMode): {
  currentSegment: string;
  rangeStart: number;
} {
  if (mode === "reference") {
    return { currentSegment: value, rangeStart: 0 };
  }

  const lastCommaIndex = value.lastIndexOf(",");
  const rangeStart = lastCommaIndex >= 0 ? lastCommaIndex + 1 : 0;
  return {
    currentSegment: value.slice(rangeStart),
    rangeStart,
  };
}

function canSuggest(segment: string): boolean {
  return /^\s*(?:[1-3]\s*)?[^0-9]*$/.test(segment);
}

function scoreCandidate(query: string, candidate: string): number {
  if (!query || !candidate) {
    return -1;
  }

  if (candidate.startsWith(query)) {
    return 100 - (candidate.length - query.length);
  }

  const containsIndex = candidate.indexOf(query);
  if (containsIndex >= 0) {
    return 80 - containsIndex;
  }

  if (isSubsequence(query, candidate)) {
    return 60 - (candidate.length - query.length);
  }

  const distance = levenshteinDistance(query, candidate.slice(0, Math.max(query.length, 1)));
  if (distance <= 2) {
    return 40 - distance * 10;
  }

  return -1;
}

function buildNextValue(
  value: string,
  rangeStart: number,
  currentSegment: string,
  bookName: string,
): string {
  const leadingWhitespace = currentSegment.match(/^\s*/)?.[0] ?? "";
  const nextSegment = `${leadingWhitespace}${bookName} `;

  return `${value.slice(0, rangeStart)}${nextSegment}${value.slice(rangeStart + currentSegment.length)}`;
}

export function BookReferenceInput({
  id,
  value,
  onChange,
  books,
  placeholder,
  mode,
}: BookReferenceInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const { currentSegment, rangeStart } = useMemo(
    () => extractActiveSegment(value, mode),
    [mode, value],
  );

  const normalizedQuery = normalize(currentSegment);
  const suggestions = useMemo(() => {
    if (!normalizedQuery || !canSuggest(currentSegment)) {
      return [] as Suggestion[];
    }

    return books
      .map((book) => {
        const bookNameScore = scoreCandidate(normalizedQuery, normalize(book.name));
        const slugScore = scoreCandidate(normalizedQuery, normalize(book.slug));
        const score = Math.max(bookNameScore, slugScore);

        return { book, score };
      })
      .filter((item) => item.score >= 0)
      .sort((left, right) => {
        if (right.score !== left.score) {
          return right.score - left.score;
        }

        return (left.book.order ?? Number.MAX_SAFE_INTEGER) - (right.book.order ?? Number.MAX_SAFE_INTEGER);
      })
      .slice(0, 6);
  }, [books, currentSegment, normalizedQuery]);

  const showSuggestions = isFocused && suggestions.length > 0;

  return (
    <div className="relative space-y-2">
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete="off"
        placeholder={placeholder}
      />

      {showSuggestions ? (
        <div className="absolute left-0 right-0 top-full z-20 overflow-hidden rounded-md border border-(--ink-200) bg-(--paper-100) shadow-lg">
          <ul>
            {suggestions.map(({ book }) => (
              <li key={book.slug}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-(--ink-900) transition hover:bg-(--paper-200)"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    onChange(buildNextValue(value, rangeStart, currentSegment, book.name));
                    setIsFocused(false);
                  }}
                >
                  <span>{book.name}</span>
                  <span className="text-xs uppercase tracking-[0.08em] text-(--ink-500)">
                    {book.testament ?? "Bible"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="text-xs text-(--ink-500)">
        Start typing a book name to pick a suggestion and avoid spelling errors.
      </p>
    </div>
  );
}