"use client";

import { useCallback, useState } from "react";
import { getBook } from "@/lib/api/bible";
import { ApiError } from "@/lib/types/api";
import { BookResultPayload } from "@/lib/types/bible";
import { toApiErrorMessage, toUnexpectedErrorMessage } from "@/lib/utils/api-error-message";

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
        setError(
          toApiErrorMessage(err, {
            actionLabel: "le livre",
            notFoundHint: "Livre introuvable. Choisissez un livre depuis la liste.",
          }),
        );
      } else {
        setError(toUnexpectedErrorMessage("le livre"));
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
