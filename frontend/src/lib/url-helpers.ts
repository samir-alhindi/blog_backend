/** Extracts the last path segment from an API hyperlink, e.g. ".../users/john/" -> "john". */
export function lastPathSegment(url: string): string {
  const segments = url.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "";
}

export function usernameFromUserUrl(url: string): string {
  return lastPathSegment(url);
}

export function slugFromPostUrl(url: string): string {
  return lastPathSegment(url);
}
