export function getBackendOrigin(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";
  if (!apiUrl || apiUrl.startsWith("/")) return "";

  try {
    return new URL(apiUrl).origin;
  } catch {
    return "";
  }
}

export function resolveMediaUrl(src: string): string {
  const value = src.trim();
  if (!value) return value;
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  const backendOrigin = getBackendOrigin();
  if (!backendOrigin) return value;

  if (value.startsWith("/uploads/")) return `${backendOrigin}${value}`;
  if (value.startsWith("uploads/")) return `${backendOrigin}/${value}`;

  return value;
}
