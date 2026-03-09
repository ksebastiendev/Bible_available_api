import 'dotenv/config';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Bible V1 (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /v1/translations returns at least LSG1910', async () => {
    const response = await request(app.getHttpServer()).get('/v1/translations').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'LSG1910',
        }),
      ]),
    );
  });

  it('GET /v1/bible/books returns ordered books for default translation', async () => {
    const response = await request(app.getHttpServer()).get('/v1/bible/books').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        slug: 'genese',
      }),
    );
  });

  it('GET /v1/bible/books/:bookSlug/chapters/:chapter returns chapter verses', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/bible/books/genese/chapters/1')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        chapter: 1,
        book: expect.objectContaining({
          slug: 'genese',
        }),
      }),
    );
    expect(Array.isArray(response.body.verses)).toBe(true);
    expect(response.body.verses.length).toBeGreaterThan(0);
  });

  it('GET /v1/bible/ref returns verse for a valid reference', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/bible/ref')
      .query({ ref: 'genese 1:1' })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        chapter: 1,
        verse: 1,
        book: expect.objectContaining({
          slug: 'genese',
        }),
      }),
    );
  });

  it('GET /v1/bible/ref returns full chapter for chapter-only references', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/bible/ref')
      .query({ ref: 'Gn 1' })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        chapter: 1,
        book: expect.objectContaining({
          slug: 'genese',
        }),
      }),
    );
    expect(Array.isArray(response.body.verses)).toBe(true);
    expect(response.body.verses.length).toBeGreaterThan(0);
  });

  it('GET /v1/bible/ref supports chapter+verset format', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/bible/ref')
      .query({ ref: 'Genese 2 verset 3' })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        chapter: 2,
        verse: 3,
        book: expect.objectContaining({
          slug: 'genese',
        }),
      }),
    );
  });

  it('GET /v1/bible/ref returns 400 for invalid reference format', async () => {
    await request(app.getHttpServer())
      .get('/v1/bible/ref')
      .query({ ref: 'badref' })
      .expect(400);
  });

  it('GET /v1/bible/ref returns 404 for valid but missing reference', async () => {
    await request(app.getHttpServer())
      .get('/v1/bible/ref')
      .query({ ref: 'genese 999:1' })
      .expect(404);
  });

  it('GET /v1/bible/search returns paginated results', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/bible/search')
      .query({ q: 'Dieu', page: 1, limit: 5 })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        page: 1,
        limit: 5,
      }),
    );
    expect(Array.isArray(response.body.results)).toBe(true);
    expect(response.body.results.length).toBeGreaterThan(0);
    expect(response.body.results[0]).toEqual(
      expect.objectContaining({
        bookSlug: expect.any(String),
        bookName: expect.any(String),
        chapter: expect.any(Number),
        verse: expect.any(Number),
        text: expect.any(String),
        translationCode: 'LSG1910',
      }),
    );
  });

  it('GET /v1/bible/passage supports single chapter', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/bible/passage')
      .query({ ref: 'Genese 1' })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        reference: 'Genese 1',
        translationCode: 'LSG1910',
      }),
    );
    expect(response.body.segments[0]).toEqual(
      expect.objectContaining({
        type: 'single_chapter',
        chapter: 1,
        book: expect.objectContaining({ slug: 'genese' }),
      }),
    );
  });

  it('GET /v1/bible/passage supports chapter range', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/bible/passage')
      .query({ ref: 'Job10-11' })
      .expect(200);

    expect(response.body.segments[0]).toEqual(
      expect.objectContaining({
        type: 'chapter_range',
        fromChapter: 10,
        toChapter: 11,
        book: expect.objectContaining({ slug: 'job' }),
      }),
    );
  });

  it('GET /v1/bible/passage supports verse range', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/bible/passage')
      .query({ ref: 'Luc19:29-40' })
      .expect(200);

    expect(response.body.segments[0]).toEqual(
      expect.objectContaining({
        type: 'verse_range',
        chapter: 19,
        fromVerse: 29,
        toVerse: 40,
        book: expect.objectContaining({ slug: 'luc' }),
      }),
    );
  });

  it('GET /v1/bible/passage supports multiple segments and preserves order', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/bible/passage')
      .query({ ref: 'Job10-11,Luc19:29-40' })
      .expect(200);

    expect(Array.isArray(response.body.segments)).toBe(true);
    expect(response.body.segments.length).toBe(2);
    expect(response.body.segments[0]).toEqual(expect.objectContaining({ type: 'chapter_range' }));
    expect(response.body.segments[1]).toEqual(expect.objectContaining({ type: 'verse_range' }));
  });

  it('GET /v1/bible/passage returns 400 for invalid format', async () => {
    await request(app.getHttpServer())
      .get('/v1/bible/passage')
      .query({ ref: '??' })
      .expect(400);
  });
});
