import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  // Both languages carry an explicit prefix (/en, /ar); "/" redirects to the
  // default. Chosen over "as-needed" so every language has a shareable,
  // SEO-distinct URL.
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
