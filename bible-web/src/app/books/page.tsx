"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { TranslationSelector } from "@/components/bible/TranslationSelector";
import { useBooks } from "@/lib/hooks/useBooks";
import { useTranslations } from "@/lib/hooks/useTranslations";

export default function BooksPage() {
  const router = useRouter();
  const { translations } = useTranslations();
  const [translation, setTranslation] = useState("LSG1910");
  const { books, loading, error } = useBooks(translation);

  const availableTranslations = useMemo(() => {
    if (translations.length === 0) {
      return [{ code: "LSG1910", name: "LSG1910" }];
    }

    return translations;
  }, [translations]);

  function onSelectBook(bookSlug: string) {
    router.push(`/book?slug=${bookSlug}&translation=${translation}`);
  }

  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-semibold text-(--ink-900)">Books</h1>

      <Card title="Options" description="Load books by translation">
        <TranslationSelector
          translations={availableTranslations}
          value={translation}
          onChange={setTranslation}
        />
      </Card>

      {loading ? <LoadingState label="Loading books..." /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && books.length === 0 ? <EmptyState message="No books found." /> : null}

      {!loading && !error && books.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <button
              key={book.slug}
              type="button"
              onClick={() => onSelectBook(book.slug)}
              className="cursor-pointer text-left focus-visible:outline-none transition hover:shadow-lg"
            >
              <Card title={book.name} description={`${book.slug} • ${book.testament ?? ""}`.trim()}>
                <div className="space-y-2">
                  <p className="text-sm text-(--ink-700)">Canonical order: {book.order ?? "N/A"}</p>
                  <p className="text-sm font-medium text-(--accent-500)">
                    Click to view the full book
                  </p>
                </div>
              </Card>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
