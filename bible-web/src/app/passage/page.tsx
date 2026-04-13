"use client";

import { FormEvent, useState } from "react";
import { BookReferenceInput } from "@/components/bible/BookReferenceInput";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { TranslationSelector } from "@/components/bible/TranslationSelector";
import { PassageViewer } from "@/components/bible/PassageViewer";
import { useBooks } from "@/lib/hooks/useBooks";
import { usePassage } from "@/lib/hooks/usePassage";
import { useTranslations } from "@/lib/hooks/useTranslations";

export default function PassagePage() {
  const { translations } = useTranslations();
  const { data, loading, error, run } = usePassage();

  const [translation, setTranslation] = useState("LSG1910");
  const [reference, setReference] = useState("Job10-11,Luc19:29-40");
  const { books } = useBooks(translation);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reference.trim()) {
      return;
    }
    run(reference.trim(), translation);
  }

  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-semibold text-[var(--ink-900)]">Passage</h1>

      <Card title="Find a passage" description="Endpoint: /v1/bible/passage">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="passage-ref" className="text-sm font-medium text-[var(--ink-700)]">
              Passage reference
            </label>
            <BookReferenceInput
              id="passage-ref"
              value={reference}
              onChange={setReference}
              books={books}
              mode="passage"
              placeholder="Ex: Job10-11,Luc19:29-40"
            />
          </div>

          <TranslationSelector
            translations={translations.length ? translations : [{ code: "LSG1910", name: "LSG1910" }]}
            value={translation}
            onChange={setTranslation}
          />

          <Button type="submit" disabled={loading || !reference.trim()}>
            {loading ? "Loading..." : "Load passage"}
          </Button>
        </form>
      </Card>

      {loading ? <LoadingState label="Loading passage..." /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && !data ? <EmptyState message="Search a Bible passage." /> : null}
      {!loading && !error && data ? <PassageViewer data={data} /> : null}
    </section>
  );
}
