"use client";

import { useEffect, useState } from "react";
import { getTranslations } from "@/lib/api/bible";
import { ApiError } from "@/lib/types/api";
import { Translation } from "@/lib/types/bible";
import { toApiErrorMessage, toUnexpectedErrorMessage } from "@/lib/utils/api-error-message";

export function useTranslations() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const data = await getTranslations();
        if (mounted) {
          setTranslations(data);
        }
      } catch (err) {
        if (!mounted) {
          return;
        }

        if (err instanceof ApiError) {
          setError(
            toApiErrorMessage(err, {
              actionLabel: "le chargement des traductions",
              notFoundHint: "Aucune traduction disponible pour le moment.",
            }),
          );
          return;
        }

        setError(toUnexpectedErrorMessage("le chargement des traductions"));
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
  }, []);

  return { translations, loading, error };
}
