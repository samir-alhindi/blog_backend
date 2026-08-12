import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer className="w-full py-8 bg-surface-container-low border-t border-outline-variant mt-auto">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-2 text-center px-margin-edge">
        <span className="font-display text-xl text-on-surface font-bold">
          Folio
        </span>
        <p className="font-ui text-xs text-on-surface-variant">
          {t("rights", { year: String(new Date().getFullYear()) })}{" "}
          {t("tagline")}
        </p>
      </div>
    </footer>
  );
}
