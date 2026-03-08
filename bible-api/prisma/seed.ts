import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Testament } from "@prisma/client";
import fs from "node:fs/promises";
import path from "node:path";

type NormalizedDataset = {
  translation: {
    code: string;
    name: string;
    license?: string | null;
    source?: string | null;
  };
  books: Array<{
    slug: string;
    name: string;
    testament: Testament;
    order: number;
    verses: Array<{
      chapter: number;
      verse: number;
      verseTexts: Array<{
        translationCode: string;
        text: string;
      }>;
    }>;
  }>;
};

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Missing DATABASE_URL environment variable.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const BATCH_SIZE = 1000;

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

async function seed() {
  const datasetPath = path.resolve(process.cwd(), "data/normalized/lsg1910.json");
  const datasetRaw = await fs.readFile(datasetPath, "utf8");
  const dataset = JSON.parse(datasetRaw) as NormalizedDataset;

  const translation = await prisma.translation.upsert({
    where: { code: dataset.translation.code },
    update: {
      name: dataset.translation.name,
      license: dataset.translation.license ?? null,
      source: dataset.translation.source ?? null,
    },
    create: {
      code: dataset.translation.code,
      name: dataset.translation.name,
      license: dataset.translation.license ?? null,
      source: dataset.translation.source ?? null,
    },
    select: { id: true, code: true },
  });

  const bookInsert = await prisma.book.createMany({
    data: dataset.books.map((book) => ({
      slug: book.slug,
      name: book.name,
      testament: book.testament,
      order: book.order,
    })),
    skipDuplicates: true,
  });

  const books = await prisma.book.findMany({
    select: { id: true, slug: true },
  });
  const bookIdBySlug = new Map(books.map((book) => [book.slug, book.id]));

  const verseRows: Array<{ bookId: number; chapter: number; verse: number }> = [];
  for (const book of dataset.books) {
    const bookId = bookIdBySlug.get(book.slug);
    if (!bookId) {
      throw new Error(`Book slug not found after insert: ${book.slug}`);
    }

    for (const verse of book.verses) {
      verseRows.push({
        bookId,
        chapter: verse.chapter,
        verse: verse.verse,
      });
    }
  }

  let insertedVerses = 0;
  for (const batch of chunkArray(verseRows, BATCH_SIZE)) {
    const result = await prisma.verse.createMany({
      data: batch,
      skipDuplicates: true,
    });
    insertedVerses += result.count;
  }

  const verses = await prisma.verse.findMany({
    select: { id: true, bookId: true, chapter: true, verse: true },
  });
  const verseIdByKey = new Map(
    verses.map((verse) => [`${verse.bookId}:${verse.chapter}:${verse.verse}`, verse.id]),
  );

  const verseTextRows: Array<{ verseId: number; translationId: number; text: string }> = [];
  for (const book of dataset.books) {
    const bookId = bookIdBySlug.get(book.slug);
    if (!bookId) {
      continue;
    }

    for (const verse of book.verses) {
      const verseKey = `${bookId}:${verse.chapter}:${verse.verse}`;
      const verseId = verseIdByKey.get(verseKey);
      if (!verseId) {
        throw new Error(`Verse not found after insert: ${book.slug} ${verse.chapter}:${verse.verse}`);
      }

      for (const verseText of verse.verseTexts) {
        if (verseText.translationCode !== translation.code) {
          continue;
        }

        verseTextRows.push({
          verseId,
          translationId: translation.id,
          text: verseText.text,
        });
      }
    }
  }

  let insertedVerseTexts = 0;
  for (const batch of chunkArray(verseTextRows, BATCH_SIZE)) {
    const result = await prisma.verseText.createMany({
      data: batch,
      skipDuplicates: true,
    });
    insertedVerseTexts += result.count;
  }

  console.log(`Translation ready: ${dataset.translation.code}`);
  console.log(`Books inserted: ${bookInsert.count}`);
  console.log(`Verses inserted: ${insertedVerses}`);
  console.log(`VerseTexts inserted: ${insertedVerseTexts}`);
  console.log(`Books total in dataset: ${dataset.books.length}`);
  console.log(`Verses total in dataset: ${verseRows.length}`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
