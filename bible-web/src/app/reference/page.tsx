"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Input } from "@/components/common/Input";
import { LoadingState } from "@/components/common/LoadingState";
import { TranslationSelector } from "@/components/bible/TranslationSelector";
import { ReferenceResult } from "@/components/bible/ReferenceResult";
import { useReference } from "@/lib/hooks/useReference";
import { useTranslations } from "@/lib/hooks/useTranslations";

export default function ReferencePage() {
  const { translations } = useTranslations();
  const { data, loading, error, run } = useReference();

  const [translation, setTranslation] = useState("LSG1910");
  const [reference, setReference] = useState("Jean 3:16");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reference.trim()) {
      return;
    }
    run(reference.trim(), translation);
  }

  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-semibold text-[var(--ink-900)]">Reference</h1>

      <Card title="Find a reference" description="Endpoint: /v1/bible/ref">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="reference" className="text-sm font-medium text-[var(--ink-700)]">
              Reference
            </label>
            <Input
              id="reference"
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="Ex: Genese 1:1"
            />
          </div>

          <TranslationSelector
            translations={translations.length ? translations : [{ code: "LSG1910", name: "LSG1910" }]}
            value={translation}
            onChange={setTranslation}
          />

          <Button type="submit" disabled={loading || !reference.trim()}>
            {loading ? "Loading..." : "Load reference"}
          </Button>
        </form>
      </Card>

      {loading ? <LoadingState label="Loading reference..." /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && !data ? <EmptyState message="Search a Bible reference." /> : null}
      {!loading && !error && data ? <ReferenceResult data={data} /> : null}
    </section>
  );
}
