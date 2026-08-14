"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const NAMES: Record<string, string> = { en: "English", ar: "العربية" };

/**
 * Segmented language control for the Settings page. Switches locale while
 * staying on the current path (only the /en|/ar prefix changes).
 */
export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: string) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div className="inline-flex rounded-lg border border-outline-variant overflow-hidden">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          disabled={isPending}
          aria-current={loc === locale ? "true" : undefined}
          className={`px-5 py-2 font-ui text-sm transition-colors disabled:opacity-60 ${
            loc === locale
              ? "bg-primary text-on-primary"
              : "text-on-surface-variant hover:bg-surface-container-low"
          }`}
        >
          {NAMES[loc]}
        </button>
      ))}
    </div>
  );
}
