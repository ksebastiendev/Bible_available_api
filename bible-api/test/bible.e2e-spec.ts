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
});
