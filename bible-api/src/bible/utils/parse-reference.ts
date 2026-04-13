export type ParsedReference = {
  bookSlug: string;
  chapter: number;
  verse?: number;
  type: 'chapter' | 'verse';
};

export class InvalidReferenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidReferenceError';
  }
}

const BOOK_ALIAS_TO_SLUG: Record<string, string> = {
  jn: 'jean',
  jean: 'jean',
  jn1: 'jean',
  gn: 'genese',
  ge: 'genese',
  gen: 'genese',
  genese: 'genese',
};

function normalizeBookKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export function parseReference(input: string): ParsedReference {
  const value = input
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\bchapitre\b/gi, ' ')
    .replace(/\bverset\b/gi, ':')
    .replace(/\s+/g, ' ')
    .trim();

  const verseMatch = value.match(/^(.+?)\s*(\d+)\s*[:.]\s*(\d+)$/i);
  if (verseMatch) {
    const rawBook = verseMatch[1];
    const chapter = Number(verseMatch[2]);
    const verse = Number(verseMatch[3]);

    if (
      !Number.isInteger(chapter) ||
      !Number.isInteger(verse) ||
      chapter < 1 ||
      verse < 1
    ) {
      throw new InvalidReferenceError(
        'Invalid chapter or verse number. Both must be positive integers.',
      );
    }

    const bookKey = normalizeBookKey(rawBook);
    const bookSlug = BOOK_ALIAS_TO_SLUG[bookKey] ?? bookKey;

    if (!bookSlug) {
      throw new InvalidReferenceError(
        `Unknown book in reference: "${rawBook}".`,
      );
    }

    return { bookSlug, chapter, verse, type: 'verse' };
  }

  const chapterMatch = value.match(/^(.+?)\s+(\d+)$/i);
  if (chapterMatch) {
    const rawBook = chapterMatch[1];
    const chapter = Number(chapterMatch[2]);

    if (!Number.isInteger(chapter) || chapter < 1) {
      throw new InvalidReferenceError(
        'Invalid chapter number. It must be a positive integer.',
      );
    }

    const bookKey = normalizeBookKey(rawBook);
    const bookSlug = BOOK_ALIAS_TO_SLUG[bookKey] ?? bookKey;

    if (!bookSlug) {
      throw new InvalidReferenceError(
        `Unknown book in reference: "${rawBook}".`,
      );
    }

    return { bookSlug, chapter, type: 'chapter' };
  }

  throw new InvalidReferenceError(
    'Invalid reference format. Use examples like "Genese 1", "Genese chapitre 1", "Gn 1", "Genese 2:3", or "Genese 2 verset 3".',
  );
}
