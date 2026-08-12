"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import { useAuth } from "@/lib/auth-context";
import type { DeletedPost } from "@/lib/types";
import { formatDate } from "@/lib/date";

export default function TrashPage() {
  const t = useTranslations("Trash");
  const tc = useTranslations("Common");
  const { user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<DeletedPost[] | null>(null);

  const load = useCallback(async () => {
    // /deleted-posts/ has no pagination — it returns a plain array.
    const data = await apiFetch<DeletedPost[]>(`${API_BASE_URL}/deleted-posts/`);
    setPosts(data);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const restore = async (slug: string) => {
    await apiFetch(`${API_BASE_URL}/deleted-posts/${slug}/`, {
      method: "PATCH",
      body: JSON.stringify({ deletion_datetime: null }),
    });
    await load();
  };

  const destroy = async (slug: string) => {
    if (!confirm(t("deleteConfirm"))) return;
    await apiFetch(`${API_BASE_URL}/deleted-posts/${slug}/`, { method: "DELETE" });
    await load();
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto w-full px-margin-edge py-stack-lg">
      <div className="mb-8 border-b border-outline-variant pb-4">
        <h1 className="font-display text-3xl text-on-surface">{t("title")}</h1>
        <p className="font-ui text-sm text-on-surface-variant mt-2">
          {t("subtitle")}
        </p>
      </div>

      {posts === null ? (
        <p className="font-ui text-on-surface-variant">{tc("loading")}</p>
      ) : posts.length === 0 ? (
        <p className="font-ui text-on-surface-variant">{t("empty")}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-surface-container-lowest border border-outline-variant rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-display text-lg text-on-surface">{post.title}</h3>
                <p className="font-ui text-xs text-on-surface-variant">
                  {t("deletedOn", { date: formatDate(post.deletion_datetime) })}
                </p>
              </div>
              <div className="flex items-center gap-3 font-ui text-sm">
                <button onClick={() => restore(post.slug)} className="text-primary">
                  {t("restore")}
                </button>
                <button
                  onClick={() => destroy(post.slug)}
                  className="text-error hover:bg-error-container px-3 py-1 rounded transition-colors"
                >
                  {t("deletePermanently")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
