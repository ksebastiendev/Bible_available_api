"use client";

import { useState } from "react";
import { getReference } from "@/lib/api/bible";
import { ApiError } from "@/lib/types/api";
import { ReferenceResultPayload } from "@/lib/types/bible";

export function useReference() {
  const [data, setData] = useState<ReferenceResultPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(ref: string, translation = "LSG1910") {
    setLoading(true);
    setError(null);

    try {
      const response = await getReference({ ref, translation });
      setData(response);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`API error (${err.status}) while loading reference.`);
      } else {
        setError("Failed to load reference.");
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, run };
}
