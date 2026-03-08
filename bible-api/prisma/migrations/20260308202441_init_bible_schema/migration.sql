-- CreateEnum
CREATE TYPE "Testament" AS ENUM ('OLD', 'NEW');

-- CreateTable
CREATE TABLE "Translation" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "license" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "testament" "Testament" NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verse" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "chapter" INTEGER NOT NULL,
    "verse" INTEGER NOT NULL,

    CONSTRAINT "Verse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerseText" (
    "id" SERIAL NOT NULL,
    "verseId" INTEGER NOT NULL,
    "translationId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "VerseText_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Translation_code_key" ON "Translation"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Book_slug_key" ON "Book"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Book_order_key" ON "Book"("order");

-- CreateIndex
CREATE INDEX "Verse_bookId_chapter_idx" ON "Verse"("bookId", "chapter");

-- CreateIndex
CREATE UNIQUE INDEX "Verse_bookId_chapter_verse_key" ON "Verse"("bookId", "chapter", "verse");

-- CreateIndex
CREATE UNIQUE INDEX "VerseText_verseId_translationId_key" ON "VerseText"("verseId", "translationId");

-- AddForeignKey
ALTER TABLE "Verse" ADD CONSTRAINT "Verse_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerseText" ADD CONSTRAINT "VerseText_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "Verse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerseText" ADD CONSTRAINT "VerseText_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
