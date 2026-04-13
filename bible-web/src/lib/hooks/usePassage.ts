"use client";

import { useState } from "react";
import { getPassage } from "@/lib/api/bible";
import { ApiError } from "@/lib/types/api";
import { PassageResultPayload } from "@/lib/types/bible";
import { toApiErrorMessage, toUnexpectedErrorMessage } from "@/lib/utils/api-error-message";

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
        setError(
          toApiErrorMessage(err, {
            actionLabel: "le chargement du passage",
            invalidHint: "Exemples valides: Genese 1, Job10-11, Luc19:29-40.",
            notFoundHint: "Passage introuvable. Verifiez le livre, chapitre et verset.",
          }),
        );
      } else {
        setError(toUnexpectedErrorMessage("le chargement du passage"));
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, run };
}
