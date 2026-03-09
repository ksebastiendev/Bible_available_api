import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BibleService } from './bible.service';
import { InvalidReferenceError } from './utils/parse-reference';

@ApiTags('Bible V1')
@Controller('v1')
export class BibleController {
  constructor(private readonly bibleService: BibleService) {}

  @ApiOperation({ summary: 'List available translations' })
  @ApiOkResponse({
    description: 'List of translations',
    schema: {
      example: [
        {
          code: 'LSG1910',
          name: 'Louis Segond 1910',
          license: 'Public Domain',
          source: 'https://ebible.org/find/details.php?id=freLSG',
        },
      ],
    },
  })
  @Get('translations')
  listTranslations() {
    return this.bibleService.listTranslations();
  }

  @ApiOperation({ summary: 'List books for a translation' })
  @ApiQuery({
    name: 'translation',
    required: false,
    description: 'Translation code',
    example: 'LSG1910',
  })
  @ApiOkResponse({
    description: 'Books ordered canonically',
    schema: {
      example: [
        {
          slug: 'genese',
          name: 'Genèse',
          testament: 'OLD',
          order: 1,
        },
      ],
    },
  })
  @Get('bible/books')
  listBooks(@Query('translation') translationCode = 'LSG1910') {
    return this.bibleService.listBooks(translationCode);
  }

  @ApiOperation({ summary: 'Get all verses of a chapter' })
  @ApiParam({ name: 'bookSlug', description: 'Book slug', example: 'genese' })
  @ApiParam({ name: 'chapter', description: 'Chapter number', example: 1 })
  @ApiQuery({
    name: 'translation',
    required: false,
    description: 'Translation code',
    example: 'LSG1910',
  })
  @ApiOkResponse({
    description: 'Chapter payload with verse texts',
    schema: {
      example: {
        translationCode: 'LSG1910',
        book: {
          slug: 'genese',
          name: 'Genèse',
          order: 1,
          testament: 'OLD',
        },
        chapter: 1,
        verses: [
          {
            verse: 1,
            text: 'Au commencement, Dieu créa les cieux et la terre.',
          },
        ],
      },
    },
  })
  @Get('bible/books/:bookSlug/chapters/:chapter')
  async getChapter(
    @Param('bookSlug') bookSlug: string,
    @Param('chapter', ParseIntPipe) chapter: number,
    @Query('translation') translationCode = 'LSG1910',
  ) {
    const result = await this.bibleService.getChapterVerses(bookSlug, chapter, translationCode);
    if (!result) {
      throw new NotFoundException('Book or chapter not found');
    }

    return result;
  }

  @ApiOperation({ summary: 'Get one verse by reference' })
  @ApiQuery({
    name: 'ref',
    required: true,
    description:
      'Reference in formats like "Genese 1", "Genese chapitre 1", "Gn 1", "Genese 2:3", "Genese 2 verset 3"',
    example: 'Genese 1',
  })
  @ApiQuery({
    name: 'translation',
    required: false,
    description: 'Translation code',
    example: 'LSG1910',
  })
  @ApiOkResponse({
    description: 'Single verse result',
    schema: {
      example: {
        translationCode: 'LSG1910',
        reference: 'genese 1:1',
        book: {
          slug: 'genese',
          name: 'Genèse',
        },
        chapter: 1,
        verse: 1,
        text: 'Au commencement, Dieu créa les cieux et la terre.',
      },
    },
  })
  @Get('bible/ref')
  async getVerseByReference(
    @Query('ref') ref?: string,
    @Query('translation') translationCode = 'LSG1910',
  ) {
    if (!ref) {
      throw new BadRequestException('Missing ref query parameter');
    }

    let result;
    try {
      result = await this.bibleService.getVerseByReference(ref, translationCode);
    } catch (error) {
      if (error instanceof InvalidReferenceError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }

    if (!result) {
      throw new NotFoundException('Reference not found or invalid format');
    }

    return result;
  }

  @ApiOperation({ summary: 'Search verses by text query' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Search query string',
    example: 'Dieu',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (starts at 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (max 100)',
    example: 20,
  })
  @ApiOkResponse({
    description: 'Paginated verse search results',
    schema: {
      example: {
        page: 1,
        limit: 20,
        total: 2,
        results: [
          {
            bookSlug: 'genese',
            bookName: 'Genèse',
            chapter: 1,
            verse: 1,
            text: 'Au commencement, Dieu créa les cieux et la terre.',
            translationCode: 'LSG1910',
          },
        ],
      },
    },
  })
  @Get('bible/search')
  async searchBible(
    @Query('q') q?: string,
    @Query('page') pageRaw?: string,
    @Query('limit') limitRaw?: string,
  ) {
    if (!q || !q.trim()) {
      throw new BadRequestException('Missing q query parameter');
    }

    const page = pageRaw ? Number(pageRaw) : 1;
    const limit = limitRaw ? Number(limitRaw) : 20;

    if (!Number.isInteger(page) || page < 1) {
      throw new BadRequestException('page must be a positive integer');
    }
    if (!Number.isInteger(limit) || limit < 1) {
      throw new BadRequestException('limit must be a positive integer');
    }

    return this.bibleService.searchVerses(q.trim(), page, Math.min(limit, 100));
  }
}
