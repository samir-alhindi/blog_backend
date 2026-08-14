"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import type { Paginated, PostSummary, User } from "@/lib/types";
import PostCard from "@/components/PostCard";

type Filter = "all" | "posts" | "writers";

export default function SearchPage() {
  const t = useTranslations("Search");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [postsNext, setPostsNext] = useState<string | null>(null);
  const [usersNext, setUsersNext] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const runSearch = async (q: string) => {
    if (!q.trim()) {
      setPosts(null);
      setUsers(null);
      setPostsNext(null);
      setUsersNext(null);
      setSearched(false);
      return;
    }
    setSearched(true);
    const [postData, userData] = await Promise.all([
      apiFetch<Paginated<PostSummary>>(
        `${API_BASE_URL}/posts/?search=${encodeURIComponent(q)}`
      ),
      apiFetch<Paginated<User>>(
        `${API_BASE_URL}/users/?search=${encodeURIComponent(q)}`
      ),
    ]);
    setPosts(postData.results);
    setUsers(userData.results);
    setPostsNext(postData.next);
    setUsersNext(userData.next);
  };

  const loadMorePosts = async () => {
    if (!postsNext) return;
    const data = await apiFetch<Paginated<PostSummary>>(postsNext);
    setPosts((prev) => [...(prev ?? []), ...data.results]);
    setPostsNext(data.next);
  };

  const loadMoreUsers = async () => {
    if (!usersNext) return;
    const data = await apiFetch<Paginated<User>>(usersNext);
    setUsers((prev) => [...(prev ?? []), ...data.results]);
    setUsersNext(data.next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const noResults =
    searched && (posts?.length ?? 0) === 0 && (users?.length ?? 0) === 0;

  return (
    <div className="max-w-3xl mx-auto w-full px-margin-edge py-stack-lg">
      <h1 className="font-display text-3xl mb-6">{t("title")}</h1>
      <form onSubmit={handleSubmit} className="relative mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("placeholder")}
          className="w-full bg-surface-container-low border border-outline-variant rounded font-ui px-4 py-3 focus:outline-none focus:border-primary"
        />
      </form>

      {searched && (
        <div className="flex gap-4 border-b border-outline-variant mb-6">
          {(["all", "posts", "writers"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-ui text-sm pb-2 border-b-2 capitalize transition-colors ${
                filter === f
                  ? "text-primary border-primary"
                  : "text-on-surface-variant border-transparent"
              }`}
            >
              {f === "all"
                ? t("filterAll")
                : f === "posts"
                ? t("filterPosts")
                : t("filterWriters")}
            </button>
          ))}
        </div>
      )}

      {noResults ? (
        <div className="flex flex-col items-center text-center py-16 gap-3">
          <h2 className="font-display text-xl text-on-surface">
            {t("noResultsTitle")}
          </h2>
          <p className="font-ui text-on-surface-variant">
            {t("noResultsBody", { query })}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {filter !== "writers" && posts && posts.length > 0 && (
            <div>
              <h3 className="font-ui text-xs uppercase tracking-wider text-on-surface-variant mb-4">
                {t("sectionPosts")}
              </h3>
              <div className="flex flex-col gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              {postsNext && (
                <button
                  onClick={loadMorePosts}
                  className="mt-4 mx-auto block font-ui text-sm text-secondary border-b border-secondary hover:opacity-80 transition-opacity"
                >
                  {t("loadMorePosts")}
                </button>
              )}
            </div>
          )}

          {filter !== "posts" && users && users.length > 0 && (
            <div>
              <h3 className="font-ui text-xs uppercase tracking-wider text-on-surface-variant mb-4">
                {t("sectionWriters")}
              </h3>
              <div className="flex flex-col gap-3">
                {users.map((u) => (
                  <Link
                    key={u.id}
                    href={`/u/${u.username}`}
                    className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant p-4 rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high relative shrink-0">
                      {u.avatar && (
                        <Image src={u.avatar} alt={u.username} fill sizes="40px" className="object-cover" />
                      )}
                    </div>
                    <div>
                      <div className="font-ui text-sm text-on-surface">@{u.username}</div>
                      {u.bio && (
                        <div className="font-ui text-xs text-on-surface-variant line-clamp-1">
                          {u.bio}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              {usersNext && (
                <button
                  onClick={loadMoreUsers}
                  className="mt-4 mx-auto block font-ui text-sm text-secondary border-b border-secondary hover:opacity-80 transition-opacity"
                >
                  {t("loadMoreWriters")}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
