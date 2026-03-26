import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiFetch } from "@/lib/api/client";
import {
  BibleBook,
  PassageResultPayload,
  ReferenceResultPayload,
  SearchResultPayload,
  Translation,
} from "@/lib/types/bible";
import { buildQueryParams } from "@/lib/utils/query-params";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function extractArray<T>(payload: unknown, keys: string[] = ["data", "items", "results"]): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  const record = asRecord(payload);
  if (!record) {
    return [];
  }

  for (const key of keys) {
    const candidate = record[key];
    if (Array.isArray(candidate)) {
      return candidate as T[];
    }
  }

  return [];
}

function extractObject<T extends object>(payload: unknown): T {
  const record = asRecord(payload);
  if (!record) {
    return {} as T;
  }

  const data = record.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data as T;
  }

  return record as T;
}

export async function getTranslations(): Promise<Translation[]> {
  const payload = await apiFetch<unknown>(API_ENDPOINTS.translations);
  return extractArray<Translation>(payload, ["data", "items", "results", "translations"]);
}

export async function getBooks(translation = "LSG1910"): Promise<BibleBook[]> {
  const query = buildQueryParams({ translation });
  const payload = await apiFetch<unknown>(`${API_ENDPOINTS.books}${query}`);
  return extractArray<BibleBook>(payload, ["data", "items", "results", "books"]);
}

export async function getReference(params: {
  ref: string;
  translation?: string;
}): Promise<ReferenceResultPayload> {
  const query = buildQueryParams({ ref: params.ref, translation: params.translation });
  const payload = await apiFetch<unknown>(`${API_ENDPOINTS.reference}${query}`);
  return extractObject<ReferenceResultPayload>(payload);
}

export async function getPassage(params: {
  ref: string;
  translation?: string;
}): Promise<PassageResultPayload> {
  const query = buildQueryParams({ ref: params.ref, translation: params.translation });
  const payload = await apiFetch<unknown>(`${API_ENDPOINTS.passage}${query}`);
  return extractObject<PassageResultPayload>(payload);
}

export async function searchBible(params: {
  q: string;
  page?: number;
  limit?: number;
}): Promise<SearchResultPayload> {
  const query = buildQueryParams({
    q: params.q,
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  });
  const payload = await apiFetch<unknown>(`${API_ENDPOINTS.search}${query}`);
  return extractObject<SearchResultPayload>(payload);
}
