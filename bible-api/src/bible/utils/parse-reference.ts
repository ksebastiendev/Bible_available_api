export type ParsedReference = {
  bookSlug: string;
  chapter: number;
  verse: number;
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
  const value = input.trim();
  const match = value.match(/^(.+?)\s*(\d+)\s*[:.]\s*(\d+)$/i);

  if (!match) {
    throw new InvalidReferenceError(
      'Invalid reference format. Use examples like "Jn 3:16", "Jean 3:16", "Jn.3.16", or "genese 1:1".',
    );
  }

  const rawBook = match[1];
  const chapter = Number(match[2]);
  const verse = Number(match[3]);

  if (!Number.isInteger(chapter) || !Number.isInteger(verse) || chapter < 1 || verse < 1) {
    throw new InvalidReferenceError('Invalid chapter or verse number. Both must be positive integers.');
  }

  const bookKey = normalizeBookKey(rawBook);
  const bookSlug = BOOK_ALIAS_TO_SLUG[bookKey] ?? bookKey;

  if (!bookSlug) {
    throw new InvalidReferenceError(`Unknown book in reference: "${rawBook}".`);
  }

  return { bookSlug, chapter, verse };
}
