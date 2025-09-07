// Prefer client-exposed env var in the browser, fall back to server env, then local dev default
export const API_URL =
	(typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
	(typeof process !== "undefined" && process.env.API_URL) ||
	"http://localhost:8000";