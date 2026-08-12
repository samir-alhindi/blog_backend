"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import ImageCropModal from "@/components/ImageCropModal";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function SignupPage() {
  const t = useTranslations("Signup");
  const { register } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [rawAvatar, setRawAvatar] = useState<{ src: string; name: string } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register({ username, password, bio, avatar });
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError && err.body && typeof err.body === "object") {
        const messages = Object.values(err.body as Record<string, string[]>)
          .flat()
          .join(" ");
        setError(messages || t("error"));
      } else {
        setError(t("error"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center gap-6 px-margin-edge py-stack-lg">
      <div className="w-full max-w-[480px] bg-surface-container-lowest border border-outline-variant p-8">
        <div className="text-center mb-6">
          <h1 className="font-display text-4xl text-primary mb-2">{t("brand")}</h1>
          <p className="font-article text-on-surface-variant">
            {t("tagline")}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <label className="w-24 h-24 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center overflow-hidden cursor-pointer">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={URL.createObjectURL(avatar)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">+</span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file)
                    setRawAvatar({ src: URL.createObjectURL(file), name: file.name });
                  e.target.value = "";
                }}
              />
            </label>
            <span className="font-ui text-xs text-on-surface-variant">
              {t("uploadAvatar")}
            </span>
          </div>

          <div>
            <label className="block font-ui text-sm mb-2" htmlFor="username">
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

          <div>
            <label className="block font-ui text-sm mb-2" htmlFor="password">
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

          <div>
            <label className="block font-ui text-sm mb-2" htmlFor="bio">
              {t("bioLabel")} <span className="text-outline">{t("optional")}</span>
            </label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-transparent border border-outline-variant p-3 resize-none focus:border-primary focus:outline-none"
            />
          </div>

          {error && <p className="font-ui text-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-on-primary font-ui py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? t("submitting") : t("submit")}
          </button>

          <p className="text-center font-ui text-sm text-on-surface-variant pt-4 border-t border-outline-variant">
            {t("haveAccount")}{" "}
            <Link href="/login" className="text-primary">
              {t("loginLink")}
            </Link>
          </p>
        </form>
      </div>

      <LanguageSwitcher />

      {rawAvatar && (
        <ImageCropModal
          src={rawAvatar.src}
          fileName={rawAvatar.name}
          aspect={1}
          cropShape="round"
          title={t("cropAvatar")}
          onCancel={() => setRawAvatar(null)}
          onCropped={(file) => {
            setAvatar(file);
            setRawAvatar(null);
          }}
        />
      )}
    </div>
  );
}
