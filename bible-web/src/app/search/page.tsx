"use client";

import { FormEvent, useState } from "react";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { SearchForm } from "@/components/bible/SearchForm";
import { SearchResults } from "@/components/bible/SearchResults";
import { useSearch } from "@/lib/hooks/useSearch";

export default function SearchPage() {
  const { data, loading, error, run } = useSearch();
  const [query, setQuery] = useState("Dieu");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }
    run(query.trim(), 1, 20);
  }

  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-semibold text-[var(--ink-900)]">Search</h1>

      <Card title="Search Bible" description="Endpoint: /v1/bible/search">
        <SearchForm query={query} onQueryChange={setQuery} onSubmit={onSubmit} loading={loading} />
      </Card>

      {loading ? <LoadingState label="Searching verses..." /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && !data ? <EmptyState message="Submit a query to see matches." /> : null}
      {!loading && !error && data ? <SearchResults data={data} /> : null}
    </section>
  );
}
