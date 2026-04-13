"use client";

import { useState } from "react";
import { getReference } from "@/lib/api/bible";
import { ApiError } from "@/lib/types/api";
import { ReferenceResultPayload } from "@/lib/types/bible";
import { toApiErrorMessage, toUnexpectedErrorMessage } from "@/lib/utils/api-error-message";

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
        setError(
          toApiErrorMessage(err, {
            actionLabel: "la reference",
            invalidHint: "Exemples valides: Genese 1:1, Gn 1, Jean 3:16.",
            notFoundHint: "Reference introuvable. Verifiez le livre, chapitre et verset.",
          }),
        );
      } else {
        setError(toUnexpectedErrorMessage("la reference"));
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, run };
}
