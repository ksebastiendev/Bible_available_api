import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { parseReference } from './utils/parse-reference';

@Injectable()
export class BibleService implements OnModuleDestroy {
  private readonly prisma: PrismaClient;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('Missing DATABASE_URL environment variable');
    }

    const adapter = new PrismaPg({ connectionString });
    this.prisma = new PrismaClient({ adapter });
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  async listTranslations() {
    return this.prisma.translation.findMany({
      select: {
        code: true,
        name: true,
        license: true,
        source: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async listBooks(translationCode: string) {
    return this.prisma.book.findMany({
      where: {
        verses: {
          some: {
            texts: {
              some: {
                translation: {
                  code: translationCode,
                },
              },
            },
          },
        },
      },
      select: {
        slug: true,
        name: true,
        testament: true,
        order: true,
      },
      orderBy: { order: 'asc' },
    });
  }

  async getChapterVerses(bookSlug: string, chapter: number, translationCode: string) {
    const book = await this.prisma.book.findUnique({
      where: { slug: bookSlug },
      select: { id: true, slug: true, name: true, order: true, testament: true },
    });

    if (!book) {
      return null;
    }

    const verses = await this.prisma.verse.findMany({
      where: {
        bookId: book.id,
        chapter,
      },
      select: {
        verse: true,
        texts: {
          where: {
            translation: {
              code: translationCode,
            },
          },
          select: {
            text: true,
            translation: {
              select: {
                code: true,
              },
            },
          },
          take: 1,
        },
      },
      orderBy: { verse: 'asc' },
    });

    return {
      translationCode,
      book: {
        slug: book.slug,
        name: book.name,
        order: book.order,
        testament: book.testament,
      },
      chapter,
      verses: verses.map((item) => ({
        verse: item.verse,
        text: item.texts[0]?.text ?? null,
      })),
    };
  }

  async getVerseByReference(reference: string, translationCode: string) {
    const parsed = parseReference(reference);

    if (parsed.type === 'chapter') {
      return this.getChapterVerses(parsed.bookSlug, parsed.chapter, translationCode);
    }

    const result = await this.prisma.verse.findFirst({
      where: {
        book: {
          slug: parsed.bookSlug,
        },
        chapter: parsed.chapter,
        verse: parsed.verse,
      },
      select: {
        chapter: true,
        verse: true,
        book: {
          select: {
            slug: true,
            name: true,
          },
        },
        texts: {
          where: {
            translation: {
              code: translationCode,
            },
          },
          select: {
            text: true,
          },
          take: 1,
        },
      },
    });

    if (!result) {
      return null;
    }

    return {
      translationCode,
      reference: `${result.book.slug} ${result.chapter}:${result.verse}`,
      book: result.book,
      chapter: result.chapter,
      verse: result.verse,
      text: result.texts[0]?.text ?? null,
    };
  }

  async searchVerses(query: string, page: number, limit: number, translationCode = 'LSG1910') {
    const skip = (page - 1) * limit;

    const where = {
      text: {
        contains: query,
        mode: 'insensitive' as const,
      },
      translation: {
        code: translationCode,
      },
    };

    const [total, matches] = await Promise.all([
      this.prisma.verseText.count({ where }),
      this.prisma.verseText.findMany({
        where,
        select: {
          text: true,
          translation: {
            select: {
              code: true,
            },
          },
          verse: {
            select: {
              chapter: true,
              verse: true,
              book: {
                select: {
                  slug: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: [
          { verse: { book: { order: 'asc' } } },
          { verse: { chapter: 'asc' } },
          { verse: { verse: 'asc' } },
        ],
        skip,
        take: limit,
      }),
    ]);

    return {
      page,
      limit,
      total,
      results: matches.map((item) => ({
        bookSlug: item.verse.book.slug,
        bookName: item.verse.book.name,
        chapter: item.verse.chapter,
        verse: item.verse.verse,
        text: item.text,
        translationCode: item.translation.code,
      })),
    };
  }
}
