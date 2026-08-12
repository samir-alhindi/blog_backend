// The rest of the UI is English copy, so dates are pinned to en-US
// regardless of the browser/OS locale (otherwise dates can render in a
// different calendar system or digit script and look garbled).
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
