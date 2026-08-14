"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import type { Follow, Paginated, User } from "@/lib/types";
import FollowButton from "./FollowButton";
import { FollowRowSkeleton } from "./Skeleton";

export default function FollowListPage({
  username,
  direction,
}: {
  username: string;
  direction: "followers" | "following";
}) {
  const t = useTranslations("FollowList");
  const tc = useTranslations("Common");
  const [users, setUsers] = useState<User[] | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Expand a page of Follow rows into the User objects they point at.
  const usersFromFollows = useCallback(
    (follows: Follow[]) =>
      Promise.all(
        follows
          .map((f) => (direction === "followers" ? f.from_user : f.to_user))
          .map((u) => apiFetch<User>(u))
      ),
    [direction]
  );

  useEffect(() => {
    const query =
      direction === "followers"
        ? `destination_username=${encodeURIComponent(username)}`
        : `source_username=${encodeURIComponent(username)}`;

    setUsers(null);
    setNextUrl(null);
    apiFetch<Paginated<Follow>>(`${API_BASE_URL}/follows/?${query}`).then(
      async (data) => {
        setUsers(await usersFromFollows(data.results));
        setNextUrl(data.next);
      }
    );
  }, [username, direction, usersFromFollows]);

  const loadMore = async () => {
    if (!nextUrl || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await apiFetch<Paginated<Follow>>(nextUrl);
      const more = await usersFromFollows(data.results);
      setUsers((prev) => [...(prev ?? []), ...more]);
      setNextUrl(data.next);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-margin-edge py-stack-lg">
      <h1 className="font-display text-2xl mb-6">
        {direction === "followers"
          ? t("followersTitle", { username })
          : t("followingTitle", { username })}
      </h1>

      {users === null ? (
        <FollowRowSkeleton />
      ) : users.length === 0 ? (
        <p className="font-ui text-on-surface-variant">{t("empty")}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between gap-4 bg-surface-container-lowest border border-outline-variant p-4 rounded-lg"
            >
              <Link href={`/u/${u.username}`} className="flex items-center gap-3">
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
              <FollowButton targetUsername={u.username} targetUserUrl={u.url} />
            </div>
          ))}
          {nextUrl && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="mt-2 mx-auto block font-ui text-sm text-secondary border-b border-secondary hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {loadingMore ? tc("loading") : tc("loadMore")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
