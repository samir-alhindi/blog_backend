"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import type { Paginated, PostSummary } from "@/lib/types";
import PostCard from "@/components/PostCard";
import { PostListSkeleton } from "@/components/Skeleton";

type Sort = "-creation_datetime" | "-reactions_count" | "-comments_count";

const SORT_OPTIONS: { value: Sort; labelKey: "sortNewest" | "sortMostReacted" | "sortMostDiscussed" }[] = [
  { value: "-creation_datetime", labelKey: "sortNewest" },
  { value: "-reactions_count", labelKey: "sortMostReacted" },
  { value: "-comments_count", labelKey: "sortMostDiscussed" },
];

export default function HomePage() {
  const t = useTranslations("Home");
  const tc = useTranslations("Common");
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("-creation_datetime");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch<Paginated<PostSummary>>(
      `${API_BASE_URL}/posts/?ordering=${sort}`
    ).then((data) => {
      setPosts(data.results);
      setNextUrl(data.next);
      setLoading(false);
    });
  }, [sort]);

  const loadMore = async () => {
    if (!nextUrl) return;
    const data = await apiFetch<Paginated<PostSummary>>(nextUrl);
    setPosts((prev) => [...prev, ...data.results]);
    setNextUrl(data.next);
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-margin-edge py-stack-lg flex flex-col gap-8">
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-outline-variant">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSort(opt.value)}
            className={`whitespace-nowrap font-ui text-sm px-4 py-1.5 rounded-full border transition-colors ${
              sort === opt.value
                ? "text-primary border-primary bg-surface-container-low"
                : "text-on-surface-variant border-outline-variant hover:border-primary"
            }`}
          >
            {t(opt.labelKey)}
          </button>
        ))}
      </div>

      {loading ? (
        <PostListSkeleton />
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16 gap-3">
          <h2 className="font-display text-2xl text-on-surface">
            {t("emptyTitle")}
          </h2>
          <p className="font-ui text-on-surface-variant">{t("emptyBody")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {nextUrl && (
        <button
          onClick={loadMore}
          className="self-center font-ui text-sm text-secondary border-b border-secondary hover:opacity-80 transition-opacity"
        >
          {tc("loadMore")}
        </button>
      )}
    </div>
  );
}
