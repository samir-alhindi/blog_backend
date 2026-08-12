import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Inline "not found" state for client pages that fetch a resource by slug or
 * username and get a 404 back. Mirrors the full-page `app/not-found.tsx` so a
 * missing post, profile, or draft reads the same as an unknown route. Callers
 * may override title/message with a context-specific translated string.
 */
export default function NotFoundState({
  title,
  message,
}: {
  title?: string;
  message?: string;
}) {
  const t = useTranslations("NotFound");

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center gap-4 py-24 px-margin-edge">
      <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-3xl">
        📖
      </div>
      <h1 className="font-display text-3xl text-on-surface">
        {title ?? t("title")}
      </h1>
      <p className="font-ui text-on-surface-variant max-w-sm">
        {message ?? t("body")}
      </p>
      <Link
        href="/"
        className="font-ui text-sm border border-outline px-6 py-3 rounded hover:bg-surface-container-low transition-colors"
      >
        {t("returnHome")}
      </Link>
    </div>
  );
}
