export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://iuceeewb.onrender.com").replace(/\/+$/, "");

export function getApiUrl(): string {
  return API_URL;
}
