import { FormEvent } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";

interface SearchFormProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

export function SearchForm({ query, onQueryChange, onSubmit, loading }: SearchFormProps) {
  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <div className="space-y-1">
        <label className="text-sm font-medium text-[var(--ink-700)]" htmlFor="search-query">
          Search term
        </label>
        <Input
          id="search-query"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Ex: Dieu"
        />
      </div>
      <Button type="submit" disabled={loading || !query.trim()}>
        {loading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
}
