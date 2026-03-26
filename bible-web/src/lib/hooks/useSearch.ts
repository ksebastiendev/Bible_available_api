"use client";

import { useState } from "react";
import { searchBible } from "@/lib/api/bible";
import { ApiError } from "@/lib/types/api";
import { SearchResultPayload } from "@/lib/types/bible";

export function useSearch() {
  const [data, setData] = useState<SearchResultPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(q: string, page = 1, limit = 20) {
    setLoading(true);
    setError(null);

    try {
      const response = await searchBible({ q, page, limit });
      setData(response);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`API error (${err.status}) while searching.`);
      } else {
        setError("Failed to search verses.");
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, run };
}
