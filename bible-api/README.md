# Bible Available API

Bible Available API is a developer-focused REST API for Bible access in French, powered by Louis Segond 1910 data.

## Stack

- NestJS
- Prisma
- PostgreSQL

## Main features

- List available translations
- List books for a translation
- Get all verses of a chapter
- Resolve Bible references (example: `Jn 3:16`, `Jean 3:16`, `Jn.3.16`, `genese 1:1`)
- Swagger documentation at `/docs`

## Available endpoints

- `GET /v1/translations`
- `GET /v1/bible/books`
- `GET /v1/bible/books/:bookSlug/chapters/:chapter`
- `GET /v1/bible/ref?ref=Jn%203:16`

## Local setup

1) Install dependencies

```bash
npm install
```

2) Configure environment

Create a `.env` file with at least:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/bible_api?schema=public
PORT=3000
```

3) Generate Prisma client

```bash
npx prisma generate
```

## Database commands

Run migrations:

```bash
npx prisma migrate deploy
```

Seed database:

```bash
npx prisma db seed
```

## Run commands

Development:

```bash
npm run start:dev
```

Production build:

```bash
npm run build
```

Production start:

```bash
npm run start:prod
```

## Swagger

- Documentation UI: `/docs`

## Dataset notes

- Translation: Louis Segond 1910 (`LSG1910`)
- Source status: public domain
- Dataset is normalized locally and seeded into PostgreSQL (no external API dependency at runtime)
