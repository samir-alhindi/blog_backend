"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { API_BASE_URL } from "@/lib/config";
import type { Follow, Paginated } from "@/lib/types";

export default function FollowButton({
  targetUsername,
  targetUserUrl,
}: {
  targetUsername: string;
  targetUserUrl: string;
}) {
  const { user } = useAuth();
  const t = useTranslations("Follow");
  const router = useRouter();
  const [follow, setFollow] = useState<Follow | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!user || user.username === targetUsername) {
      setFollow(null);
      return;
    }
    const data = await apiFetch<Paginated<Follow>>(
      `${API_BASE_URL}/follows/?source_username=${encodeURIComponent(
        user.username
      )}&destination_username=${encodeURIComponent(targetUsername)}`
    );
    setFollow(data?.results?.[0] ?? null);
  }, [user, targetUsername]);

  useEffect(() => {
    load();
  }, [load]);

  if (user?.username === targetUsername) return null;

  const toggle = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (busy || follow === undefined) return;

    // Optimistic: flip the label immediately, reconcile via load() (which
    // fetches the real Follow row, including the url a later unfollow needs).
    const prev = follow;
    setFollow(
      prev ? null : ({ url: "", to_user: targetUserUrl } as Follow)
    );
    setBusy(true);
    try {
      if (prev) {
        await apiFetch(prev.url, { method: "DELETE" });
      } else {
        await apiFetch(`${API_BASE_URL}/follows/`, {
          method: "POST",
          body: JSON.stringify({ to_user: targetUserUrl }),
        });
      }
      await load();
    } catch {
      setFollow(prev); // roll back on failure
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={`font-ui text-sm px-5 py-2 rounded-full border transition-colors disabled:opacity-50 ${
        follow
          ? "border-outline-variant text-on-surface hover:bg-surface-container-low"
          : "border-primary bg-primary text-on-primary hover:opacity-90"
      }`}
    >
      {follow ? t("following") : t("follow")}
    </button>
  );
}
