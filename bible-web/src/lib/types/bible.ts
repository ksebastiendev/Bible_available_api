export interface Translation {
  code: string;
  name: string;
  license?: string;
  source?: string;
  [key: string]: unknown;
}

export interface BibleBook {
  slug: string;
  name: string;
  testament?: string;
  order?: number;
  [key: string]: unknown;
}

export interface VerseLine {
  chapter?: number;
  verse: number;
  text: string | null;
  translationCode?: string;
  [key: string]: unknown;
}

export interface ReferenceResultPayload {
  translationCode?: string;
  reference?: string;
  book?: BibleBook;
  chapter?: number;
  verse?: number;
  text?: string | null;
  verses?: VerseLine[];
  [key: string]: unknown;
}

export interface PassageSegment {
  type: string;
  book?: BibleBook;
  chapter?: number;
  fromChapter?: number;
  toChapter?: number;
  fromVerse?: number;
  toVerse?: number;
  verses: VerseLine[];
  [key: string]: unknown;
}

export interface PassageResultPayload {
  reference?: string;
  translationCode?: string;
  segments: PassageSegment[];
  [key: string]: unknown;
}

export interface SearchResultItem {
  bookSlug: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  translationCode: string;
  [key: string]: unknown;
}

export interface SearchResultPayload {
  page: number;
  limit: number;
  total: number;
  results: SearchResultItem[];
  [key: string]: unknown;
}
