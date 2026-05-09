const TOKEN_KEY = "rasas_token";
const TOKEN_EXPIRY_KEY = "rasas_token_expires_at";
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export function storeAuthToken(token: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + TOKEN_TTL_MS));
  } catch {
    // Ignore storage failures; authenticated server cookies still carry the session.
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    const expiry = Number(localStorage.getItem(TOKEN_EXPIRY_KEY));
    if (Number.isFinite(expiry) && expiry > 0 && Date.now() > expiry) {
      clearAuthToken();
      return null;
    }

    return token;
  } catch {
    return null;
  }
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  } catch {
    // Ignore storage failures.
  }
}