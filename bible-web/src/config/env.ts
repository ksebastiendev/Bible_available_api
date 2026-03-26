const rawApiBaseUrl =
  process.env.NEXT_PUBLIC_BIBLE_API_BASE_URL?.trim() || "http://localhost:3000";

export const env = {
  apiBaseUrl: rawApiBaseUrl.replace(/\/+$/, ""),
};
