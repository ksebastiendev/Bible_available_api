import { InvalidReferenceError } from './parse-reference';

export type ParsedPassageSegment =
  | {
      type: 'single_chapter';
      bookSlug: string;
      chapter: number;
    }
  | {
      type: 'chapter_range';
      bookSlug: string;
      fromChapter: number;
      toChapter: number;
    }
  | {
      type: 'verse_range';
      bookSlug: string;
      chapter: number;
      fromVerse: number;
      toVerse: number;
    };

export type ParsedPassageReference = {
  originalReference: string;
  segments: ParsedPassageSegment[];
};

export class InvalidPassageError extends InvalidReferenceError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPassageError';
  }
}

const BOOK_ALIAS_TO_SLUG: Record<string, string> = {
  gn: 'genese',
  ge: 'genese',
  gen: 'genese',
  genese: 'genese',
  job: 'job',
  jb: 'job',
  luc: 'luc',
  lu: 'luc',
  lk: 'luc',
};

function normalizeBookAliasKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function normalizeBookSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function resolveBookSlug(rawBook: string): string {
  const aliasKey = normalizeBookAliasKey(rawBook);
  return BOOK_ALIAS_TO_SLUG[aliasKey] ?? normalizeBookSlug(rawBook);
}

function toPositiveInt(value: string, label: string): number {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) {
    throw new InvalidPassageError(`${label} must be a positive integer.`);
  }
  return number;
}

function parseSegment(segmentRaw: string): ParsedPassageSegment {
  const normalized = segmentRaw
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');

  const verseRangeMatch = normalized.match(
    /^(.+?)\s*(\d+)\s*[:.]\s*(\d+)\s*-\s*(\d+)$/i,
  );
  if (verseRangeMatch) {
    const bookSlug = resolveBookSlug(verseRangeMatch[1]);
    const chapter = toPositiveInt(verseRangeMatch[2], 'chapter');
    const fromVerse = toPositiveInt(verseRangeMatch[3], 'fromVerse');
    const toVerse = toPositiveInt(verseRangeMatch[4], 'toVerse');

    if (toVerse < fromVerse) {
      throw new InvalidPassageError(
        'toVerse must be greater than or equal to fromVerse.',
      );
    }

    return {
      type: 'verse_range',
      bookSlug,
      chapter,
      fromVerse,
      toVerse,
    };
  }

  const chapterRangeMatch = normalized.match(/^(.+?)\s*(\d+)\s*-\s*(\d+)$/i);
  if (chapterRangeMatch) {
    const bookSlug = resolveBookSlug(chapterRangeMatch[1]);
    const fromChapter = toPositiveInt(chapterRangeMatch[2], 'fromChapter');
    const toChapter = toPositiveInt(chapterRangeMatch[3], 'toChapter');

    if (toChapter < fromChapter) {
      throw new InvalidPassageError(
        'toChapter must be greater than or equal to fromChapter.',
      );
    }

    return {
      type: 'chapter_range',
      bookSlug,
      fromChapter,
      toChapter,
    };
  }

  const chapterMatch = normalized.match(/^(.+?)\s*(\d+)$/i);
  if (chapterMatch) {
    const bookSlug = resolveBookSlug(chapterMatch[1]);
    const chapter = toPositiveInt(chapterMatch[2], 'chapter');

    return {
      type: 'single_chapter',
      bookSlug,
      chapter,
    };
  }

  throw new InvalidPassageError(
    `Invalid passage segment: "${segmentRaw}". Supported examples: "Genese1", "Job10-11", "Luc19:29-40".`,
  );
}

export function parsePassage(reference: string): ParsedPassageReference {
  const value = reference.trim();
  if (!value) {
    throw new InvalidPassageError('Missing passage reference.');
  }

  const segments = value
    .split(',')
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
    .map(parseSegment);

  if (segments.length === 0) {
    throw new InvalidPassageError('Passage reference is empty.');
  }

  return {
    originalReference: value,
    segments,
  };
}
