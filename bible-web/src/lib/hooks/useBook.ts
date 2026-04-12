"use client";

import { useCallback, useState } from "react";
import { getBook } from "@/lib/api/bible";
import { ApiError } from "@/lib/types/api";
import { BookResultPayload } from "@/lib/types/bible";

export function useBook() {
  const [data, setData] = useState<BookResultPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (slug: string, translation = "LSG1910") => {
    setLoading(true);
    setError(null);

    try {
      const response = await getBook({ slug, translation });
      setData(response);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`API error (${err.status}) while loading book.`);
      } else {
        setError("Failed to load book.");
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, run, clear };
}
