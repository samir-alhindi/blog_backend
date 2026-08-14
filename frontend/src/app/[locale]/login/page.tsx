"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const t = useTranslations("Login");
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
      router.push("/");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? t("errorCredentials")
          : t("errorGeneric")
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center px-margin-edge py-stack-lg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-5xl text-primary">{t("brand")}</h1>
          <p className="font-article text-on-surface-variant mt-2">
            {t("tagline")}
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-xl">
          <h2 className="font-display text-2xl mb-6 text-center">{t("heading")}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-ui text-sm text-on-surface-variant" htmlFor="username">
                {t("username")}
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none py-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-ui text-sm text-on-surface-variant" htmlFor="password">
                {t("password")}
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none py-2"
              />
            </div>
            {error && (
              <p className="font-ui text-sm text-error">{error}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-on-primary font-ui py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? t("submitting") : t("submit")}
            </button>
          </form>
        </div>
        <p className="text-center mt-6 font-ui text-sm text-on-surface-variant">
          {t("noAccount")}{" "}
          <Link href="/signup" className="text-primary font-bold">
            {t("signupLink")}
          </Link>
        </p>
        <div className="mt-8 flex justify-center">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
