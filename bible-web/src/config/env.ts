const defaultApiBaseUrl = "http://localhost:3000";

const rawApiBaseUrl = process.env.NEXT_PUBLIC_BIBLE_API_BASE_URL?.trim() || defaultApiBaseUrl;

const normalizedApiBaseUrl = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(rawApiBaseUrl)
  ? rawApiBaseUrl
  : `http://${rawApiBaseUrl}`;

export const env = {
  apiBaseUrl: normalizedApiBaseUrl.replace(/\/+$/, ""),
};
