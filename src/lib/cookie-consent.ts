export type CookieConsentValue = "accepted" | "rejected";

const STORAGE_KEY = "cookie_consent";

const GA_COOKIE_PREFIXES = ["_ga", "_gid", "_gat"];

// --- 純粋関数 ---

export function isValidConsentValue(
  value: string | null,
): value is CookieConsentValue {
  return value === "accepted" || value === "rejected";
}

// --- 副作用関数 ---

export function getCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(STORAGE_KEY);
  if (isValidConsentValue(value)) return value;
  return null;
}

export function setCookieConsent(value: CookieConsentValue): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, value);

  if (value === "rejected") {
    removeGaCookies();
  }
}

export function hasRespondedToConsent(): boolean {
  return getCookieConsent() !== null;
}

function removeGaCookies(): void {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const name = cookie.split("=")[0].trim();
    if (GA_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix))) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
    }
  }
}
