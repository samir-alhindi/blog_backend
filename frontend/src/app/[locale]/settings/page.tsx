"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast";
import ImageCropModal from "@/components/ImageCropModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function SettingsPage() {
  const t = useTranslations("Settings");
  const tc = useTranslations("Common");
  const { user, loading, refreshUser, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [rawAvatar, setRawAvatar] = useState<{ src: string; name: string } | null>(
    null
  );
  const [profileSaving, setProfileSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [confirming, setConfirming] = useState<null | "logout" | "delete">(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (user) setBio(user.bio);
  }, [loading, user, router]);

  if (!user) return null;

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const form = new FormData();
      form.append("bio", bio);
      if (avatar) form.append("avatar", avatar);
      await apiFetch(`${API_BASE_URL}/users/${user.username}/`, {
        method: "PATCH",
        body: form,
      });
      await refreshUser();
      toast(t("saved"));
    } catch {
      toast(t("saveError"), "error");
    } finally {
      setProfileSaving(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast(t("passwordMismatch"), "error");
      return;
    }
    setPasswordSaving(true);
    try {
      await apiFetch(`${API_BASE_URL}/users/${user.username}/password/`, {
        method: "PATCH",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      toast(t("passwordUpdated"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err instanceof ApiError && err.body && typeof err.body === "object") {
        toast(
          Object.values(err.body as Record<string, string[]>).flat().join(" "),
          "error"
        );
      } else {
        toast(t("passwordError"), "error");
      }
    } finally {
      setPasswordSaving(false);
    }
  };

  const doLogout = () => {
    setConfirming(null);
    logout();
    router.push("/");
  };

  const doDelete = async () => {
    setConfirming(null);
    await apiFetch(`${API_BASE_URL}/users/${user.username}/`, { method: "DELETE" });
    logout();
    router.push("/");
  };

  const avatarSrc = avatar ? URL.createObjectURL(avatar) : user.avatar;

  const label = "block font-ui text-sm font-medium text-on-surface mb-1.5";
  const input =
    "w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3.5 py-2.5 font-ui text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition";
  const primaryBtn =
    "bg-primary text-on-primary font-ui text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50";
  const cardClass =
    "bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden";
  const cardHead = "px-6 py-5 border-b border-outline-variant";
  const cardTitle = "font-ui text-base font-semibold text-on-surface";
  const cardDesc = "font-ui text-sm text-on-surface-variant mt-0.5";
  const cardFoot =
    "px-6 py-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-end gap-4";

  return (
    <div className="max-w-2xl mx-auto w-full px-margin-edge py-stack-lg flex flex-col gap-8">
      <header>
        <h1 className="font-display text-3xl md:text-4xl text-on-surface">
          {t("title")}
        </h1>
        <p className="font-ui text-on-surface-variant mt-2">{t("subtitle")}</p>
      </header>

      {/* Profile */}
      <form onSubmit={saveProfile} className={cardClass}>
        <div className={cardHead}>
          <h2 className={cardTitle}>{t("profileSection")}</h2>
          <p className={cardDesc}>{t("profileDesc")}</p>
        </div>

        <div className="px-6 py-6 flex flex-col gap-6">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative group shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="block w-16 h-16 rounded-full overflow-hidden bg-surface-container-high ring-1 ring-outline-variant flex items-center justify-center font-display text-lg text-on-surface-variant">
                {avatarSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
                ) : (
                  user.username.slice(0, 2).toUpperCase()
                )}
              </span>
              <span className="absolute inset-0 rounded-full bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </span>
            </button>
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="font-ui text-sm font-medium text-primary hover:opacity-80 transition-opacity"
              >
                {t("changePhoto")}
              </button>
              <p className="font-ui text-xs text-on-surface-variant mt-1">
                {t("avatarHint")}
              </p>
            </div>
            <input
              ref={fileRef}
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
          </div>

          <div>
            <label className={label} htmlFor="username">
              {t("username")}
            </label>
            <input
              id="username"
              value={`@${user.username}`}
              disabled
              className={`${input} opacity-60 cursor-not-allowed`}
            />
          </div>

          <div>
            <label className={label} htmlFor="bio">
              {t("bio")}
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className={`${input} resize-y`}
            />
          </div>
        </div>

        <div className={cardFoot}>
          <button type="submit" disabled={profileSaving} className={primaryBtn}>
            {t("saveChanges")}
          </button>
        </div>
      </form>

      {/* Security */}
      <form onSubmit={savePassword} className={cardClass}>
        <div className={cardHead}>
          <h2 className={cardTitle}>{t("securitySection")}</h2>
          <p className={cardDesc}>{t("securityDesc")}</p>
        </div>

        <div className="px-6 py-6 flex flex-col gap-5 max-w-sm">
          <div>
            <label className={label}>{t("currentPassword")}</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={input}
            />
          </div>
          <div>
            <label className={label}>{t("newPassword")}</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={input}
            />
          </div>
          <div>
            <label className={label}>{t("confirmPassword")}</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={input}
            />
          </div>
        </div>

        <div className={cardFoot}>
          <button type="submit" disabled={passwordSaving} className={primaryBtn}>
            {t("updatePassword")}
          </button>
        </div>
      </form>

      {/* Preferences */}
      <section className={cardClass}>
        <div className={cardHead}>
          <h2 className={cardTitle}>{t("preferencesSection")}</h2>
          <p className={cardDesc}>{t("languageDesc")}</p>
        </div>
        <div className="px-6 py-6 flex items-center justify-between gap-4 flex-wrap">
          <span className="font-ui text-sm font-medium text-on-surface">
            {t("language")}
          </span>
          <LanguageSwitcher />
        </div>
      </section>

      {/* Session */}
      <section className={cardClass}>
        <div className={cardHead}>
          <h2 className={cardTitle}>{t("sessionSection")}</h2>
          <p className={cardDesc}>{t("logoutDesc")}</p>
        </div>
        <div className="px-6 py-6 flex items-center justify-between gap-4 flex-wrap">
          <span className="font-ui text-sm text-on-surface-variant">
            @{user.username}
          </span>
          <button
            type="button"
            onClick={() => setConfirming("logout")}
            className="border border-outline text-on-surface font-ui text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-surface-container-low transition-colors"
          >
            {t("logout")}
          </button>
        </div>
      </section>

      {/* Danger zone */}
      <section className="bg-surface-container-lowest border border-error/40 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-error/30 bg-error-container/20">
          <h2 className="font-ui text-base font-semibold text-error">
            {t("dangerZone")}
          </h2>
        </div>
        <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <p className="font-ui text-sm text-on-surface-variant max-w-sm leading-relaxed">
            {t("dangerBody")}
          </p>
          <button
            type="button"
            onClick={() => setConfirming("delete")}
            className="shrink-0 border border-error text-error font-ui text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-error hover:text-on-error transition-colors"
          >
            {t("deleteAccount")}
          </button>
        </div>
      </section>

      <ConfirmDialog
        open={confirming === "logout"}
        title={t("logoutConfirmTitle")}
        message={t("logoutConfirmBody")}
        confirmLabel={t("logout")}
        cancelLabel={tc("cancel")}
        onConfirm={doLogout}
        onCancel={() => setConfirming(null)}
      />

      <ConfirmDialog
        open={confirming === "delete"}
        title={t("deleteConfirmTitle")}
        message={t("deleteConfirm")}
        confirmLabel={t("deleteAccount")}
        cancelLabel={tc("cancel")}
        tone="danger"
        onConfirm={doDelete}
        onCancel={() => setConfirming(null)}
      />

      {rawAvatar && (
        <ImageCropModal
          src={rawAvatar.src}
          fileName={rawAvatar.name}
          aspect={1}
          cropShape="round"
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
