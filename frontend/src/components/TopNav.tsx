"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth-context";

export default function TopNav() {
  const { user, loading } = useAuth();
  const t = useTranslations("Nav");

  return (
    <header className="w-full sticky top-0 bg-background border-b border-outline-variant z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-margin-edge h-20">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-display text-2xl font-bold text-primary tracking-tight"
          >
            Folio
          </Link>
          <nav className="hidden md:flex gap-6 items-center font-ui text-sm text-on-surface-variant">
            <Link href="/" className="hover:text-primary transition-colors">
              {t("explore")}
            </Link>
            {user && (
              <Link
                href="/bookmarks"
                className="hover:text-primary transition-colors"
              >
                {t("bookmarks")}
              </Link>
            )}
            <Link
              href="/search"
              className="hover:text-primary transition-colors"
            >
              {t("search")}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {loading ? null : user ? (
            <>
              <Link
                href="/write"
                className="hidden md:inline-flex bg-primary text-on-primary font-ui text-sm font-medium px-5 py-2 rounded hover:opacity-90 transition-opacity"
              >
                {t("write")}
              </Link>
              <Link
                href="/settings"
                title={t("settings")}
                aria-label={t("settings")}
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </Link>
              <Link
                href={`/u/${user.username}`}
                className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant bg-surface-container-high flex items-center justify-center text-xs font-ui text-on-surface-variant"
                title={user.username}
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.username}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.username.slice(0, 2).toUpperCase()
                )}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-ui text-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                {t("login")}
              </Link>
              <Link
                href="/signup"
                className="bg-primary text-on-primary font-ui text-sm font-medium px-5 py-2 rounded hover:opacity-90 transition-opacity"
              >
                {t("signup")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
