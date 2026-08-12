"use client";

import { use, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { slugFromPostUrl } from "@/lib/url-helpers";
import { formatDate } from "@/lib/date";
import type { CommentDetail, Paginated, PostSummary, User } from "@/lib/types";
import PostCard from "@/components/PostCard";
import FollowButton from "@/components/FollowButton";
import NotFoundState from "@/components/NotFoundState";
import { ProfileSkeleton, PostListSkeleton } from "@/components/Skeleton";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const t = useTranslations("Profile");
  const tc = useTranslations("Common");
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<User | null | "not-found">(null);
  const [tab, setTab] = useState<"posts" | "comments">("posts");
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [comments, setComments] = useState<CommentDetail[] | null>(null);

  useEffect(() => {
    apiFetch<User>(`/users/${username}/`)
      .then(setProfile)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setProfile("not-found");
        }
      });
  }, [username]);

  useEffect(() => {
    if (!profile || profile === "not-found") return;
    if (tab === "posts" && posts === null) {
      apiFetch<Paginated<PostSummary>>(profile.posts).then((data) =>
        setPosts(data.results)
      );
    }
    if (tab === "comments" && comments === null) {
      apiFetch<Paginated<CommentDetail>>(profile.comments).then((data) =>
        setComments(data.results)
      );
    }
  }, [profile, tab, posts, comments]);

  if (profile === "not-found") {
    return (
      <NotFoundState
        title={t("notFoundTitle")}
        message={t("notFoundBody")}
      />
    );
  }

  if (!profile) {
    return <ProfileSkeleton />;
  }

  const isOwnProfile = currentUser?.username === profile.username;

  return (
    <div className="max-w-3xl mx-auto w-full px-margin-edge py-stack-lg">
      <section className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant relative shrink-0">
          {profile.avatar && (
            <Image src={profile.avatar} alt={profile.username} fill sizes="128px" className="object-cover" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
            <h2 className="font-display text-2xl text-on-surface">@{profile.username}</h2>
            {isOwnProfile ? (
              <Link
                href="/settings"
                className="border border-outline text-on-surface font-ui text-sm py-2 px-6 rounded-full hover:bg-surface-container-low transition-colors"
              >
                {t("editProfile")}
              </Link>
            ) : (
              <FollowButton targetUsername={profile.username} targetUserUrl={profile.url} />
            )}
          </div>
          {profile.bio && (
            <p className="font-article text-on-surface mb-4">{profile.bio}</p>
          )}
          <div className="flex gap-6 font-ui text-sm">
            <Link href={`/u/${profile.username}/followers`} className="hover:text-primary">
              <span className="font-bold text-on-surface">{profile.followers_count}</span>{" "}
              <span className="text-on-surface-variant">{t("followers")}</span>
            </Link>
            <Link href={`/u/${profile.username}/following`} className="hover:text-primary">
              <span className="font-bold text-on-surface">{profile.following_count}</span>{" "}
              <span className="text-on-surface-variant">{t("following")}</span>
            </Link>
          </div>
        </div>
      </section>

      <nav className="border-b border-outline-variant mb-6 flex gap-8">
        <button
          onClick={() => setTab("posts")}
          className={`font-ui text-sm pb-3 px-2 border-b-2 transition-colors ${
            tab === "posts" ? "text-primary border-primary" : "text-on-surface-variant border-transparent"
          }`}
        >
          {t("tabPosts")}
        </button>
        <button
          onClick={() => setTab("comments")}
          className={`font-ui text-sm pb-3 px-2 border-b-2 transition-colors ${
            tab === "comments" ? "text-primary border-primary" : "text-on-surface-variant border-transparent"
          }`}
        >
          {t("tabComments")}
        </button>
      </nav>

      {tab === "posts" ? (
        <div className="flex flex-col gap-6">
          {posts === null ? (
            <PostListSkeleton count={2} />
          ) : posts.length === 0 ? (
            <p className="font-ui text-on-surface-variant">{t("noPosts")}</p>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {comments === null ? (
            <p className="font-ui text-on-surface-variant">{tc("loading")}</p>
          ) : comments.length === 0 ? (
            <p className="font-ui text-on-surface-variant">{t("noComments")}</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg"
              >
                <p className="font-caption text-xs text-on-surface-variant mb-2">
                  {t.rich("commentedOn", {
                    date: formatDate(comment.creation_datetime),
                    link: (chunks) => (
                      <Link
                        href={`/posts/${slugFromPostUrl(comment.post)}`}
                        className="text-primary hover:underline"
                      >
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
                <p className="font-article text-sm text-on-surface">{comment.body}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
