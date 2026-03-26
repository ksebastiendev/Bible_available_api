export function buildQueryParams(
  params: Record<string, string | number | boolean | undefined>,
): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      continue;
    }

    query.set(key, String(value));
  }

  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}
