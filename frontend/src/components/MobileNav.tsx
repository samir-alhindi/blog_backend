"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth-context";

function Icon({ path, filled = false }: { path: string; filled?: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

const ICONS = {
  home: "M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-3.5-3.5",
  bookmark: "M6 3a1 1 0 0 0-1 1v17l7-4.5 7 4.5V4a1 1 0 0 0-1-1H6Z",
  person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0",
};

function Tab({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
        active ? "text-primary" : "text-on-surface-variant"
      }`}
    >
      <Icon path={ICONS[icon]} filled={active} />
      <span className="font-ui text-[10px] leading-none">{label}</span>
    </Link>
  );
}

/**
 * App-style bottom tab bar for mobile (hidden on md+). Frosted bar with a
 * raised primary "Write" action in the centre, à la Instagram — but in Folio's
 * quieter, editorial palette.
 */
export default function MobileNav() {
  const { user, loading } = useAuth();
  const t = useTranslations("MobileNav");
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (loading) return null;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-background/85 backdrop-blur-lg border-t border-outline-variant pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch justify-around h-16 max-w-lg mx-auto px-2">
        <Tab href="/" label={t("home")} icon="home" active={isActive("/")} />
        <Tab
          href="/search"
          label={t("search")}
          icon="search"
          active={isActive("/search")}
        />

        {/* Raised create action */}
        <Link
          href="/write"
          aria-label="Write"
          className="flex items-center justify-center flex-1"
        >
          <span className="-mt-6 w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-background">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </Link>

        {user && (
          <Tab
            href="/bookmarks"
            label={t("saved")}
            icon="bookmark"
            active={isActive("/bookmarks")}
          />
        )}

        {user ? (
          <Link
            href={`/u/${user.username}`}
            aria-label="Profile"
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
              pathname.startsWith(`/u/${user.username}`)
                ? "text-primary"
                : "text-on-surface-variant"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center text-[9px] ${
                pathname.startsWith(`/u/${user.username}`)
                  ? "ring-2 ring-primary"
                  : ""
              }`}
            >
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.username}
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.username.slice(0, 2).toUpperCase()
              )}
            </span>
            <span className="font-ui text-[10px] leading-none">{t("you")}</span>
          </Link>
        ) : (
          <Tab
            href="/login"
            label={t("login")}
            icon="person"
            active={isActive("/login")}
          />
        )}
      </div>
    </nav>
  );
}
