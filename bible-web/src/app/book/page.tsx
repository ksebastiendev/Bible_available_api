"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { BookViewer } from "@/components/bible/BookViewer";
import { Button } from "@/components/common/Button";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { useBook } from "@/lib/hooks/useBook";
import Link from "next/link";

export default function BookPage() {
  const searchParams = useSearchParams();
  const slug = useMemo(() => searchParams.get("slug") ?? "", [searchParams]);
  const translation = useMemo(() => searchParams.get("translation") ?? "LSG1910", [searchParams]);
  const { data: book, loading, error, run: loadBook } = useBook();

  useEffect(() => {
    if (slug) {
      loadBook(slug, translation);
    }
  }, [slug, translation, loadBook]);

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-(--ink-900)">
          {book?.book?.name ?? "Book"}
        </h1>
        <Link href="/books">
          <Button variant="secondary">Back to books</Button>
        </Link>
      </div>

      {loading ? <LoadingState label="Loading book..." /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && book ? <BookViewer data={book} /> : null}
    </section>
  );
}
