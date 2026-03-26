"use client";

import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { useTranslations } from "@/lib/hooks/useTranslations";

export default function TranslationsPage() {
  const { translations, loading, error } = useTranslations();

  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-semibold text-[var(--ink-900)]">Translations</h1>

      {loading ? <LoadingState label="Loading translations..." /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && translations.length === 0 ? (
        <EmptyState message="No translation found." />
      ) : null}

      {!loading && !error && translations.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {translations.map((item) => (
            <Card key={item.code} title={`${item.name} (${item.code})`}>
              <ul className="space-y-2 text-sm text-[var(--ink-700)]">
                <li>
                  <strong>License:</strong> {item.license ?? "N/A"}
                </li>
                <li>
                  <strong>Source:</strong> {item.source ?? "N/A"}
                </li>
              </ul>
            </Card>
          ))}
        </div>
      ) : null}
    </section>
  );
}
