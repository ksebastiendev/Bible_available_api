"use client";

import { useEffect, useState } from "react";
import { getBooks } from "@/lib/api/bible";
import { ApiError } from "@/lib/types/api";
import { BibleBook } from "@/lib/types/bible";

export function useBooks(translation = "LSG1910") {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const data = await getBooks(translation);
        if (mounted) {
          setBooks(data);
        }
      } catch (err) {
        if (!mounted) {
          return;
        }

        if (err instanceof ApiError) {
          setError(`API error (${err.status}) while loading books.`);
          return;
        }

        setError("Failed to load books.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      mounted = false;
    };
  }, [translation]);

  return { books, loading, error };
}
