"use client";

import { useState } from "react";
import { getPassage } from "@/lib/api/bible";
import { ApiError } from "@/lib/types/api";
import { PassageResultPayload } from "@/lib/types/bible";

export function usePassage() {
  const [data, setData] = useState<PassageResultPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(ref: string, translation = "LSG1910") {
    setLoading(true);
    setError(null);

    try {
      const response = await getPassage({ ref, translation });
      setData(response);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`API error (${err.status}) while loading passage.`);
      } else {
        setError("Failed to load passage.");
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, run };
}
