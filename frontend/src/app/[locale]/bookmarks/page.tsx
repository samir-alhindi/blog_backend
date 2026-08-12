"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import { useAuth } from "@/lib/auth-context";
import type { Bookmark, PostDetail } from "@/lib/types";
import PostCard from "@/components/PostCard";

export default function BookmarksPage() {
  const t = useTranslations("Bookmarks");
  const tc = useTranslations("Common");
  const { user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<PostDetail[] | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    // /bookmarks/ has no pagination_class set, so it's a plain array.
    apiFetch<Bookmark[]>(`${API_BASE_URL}/bookmarks/`).then(async (data) => {
      const fetched = await Promise.all(
        data.map((b) => apiFetch<PostDetail>(b.post))
      );
      setPosts(fetched);
    });
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto w-full px-margin-edge py-stack-lg">
      <h1 className="font-display text-3xl mb-8">{t("title")}</h1>

      {posts === null ? (
        <p className="font-ui text-on-surface-variant">{tc("loading")}</p>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16 gap-3">
          <h2 className="font-display text-2xl text-on-surface">
            {t("emptyTitle")}
          </h2>
          <p className="font-ui text-on-surface-variant">{t("emptyBody")}</p>
          <Link
            href="/"
            className="mt-2 bg-primary text-on-primary font-ui px-6 py-2 rounded"
          >
            {t("exploreCta")}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
