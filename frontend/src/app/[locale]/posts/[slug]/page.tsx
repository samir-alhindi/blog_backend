"use client";

import { use, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import { useAuth } from "@/lib/auth-context";
import { usernameFromUserUrl } from "@/lib/url-helpers";
import { formatDate } from "@/lib/date";
import type { PostDetail } from "@/lib/types";
import ReactionBar from "@/components/ReactionBar";
import BookmarkButton from "@/components/BookmarkButton";
import FollowButton from "@/components/FollowButton";
import CommentThread from "@/components/CommentThread";
import NotFoundState from "@/components/NotFoundState";
import { PostDetailSkeleton } from "@/components/Skeleton";
import Markdown from "@/components/Markdown";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations("PostDetail");
  const { user } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<PostDetail | null | "not-found">(null);

  useEffect(() => {
    apiFetch<PostDetail>(`${API_BASE_URL}/posts/${slug}/`)
      .then(setPost)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setPost("not-found");
        }
      });
  }, [slug]);

  if (post === "not-found") {
    return <NotFoundState message={t("notFound")} />;
  }

  if (!post) {
    return <PostDetailSkeleton />;
  }

  const authorUsername = usernameFromUserUrl(post.author);
  const isAuthor = user?.username === authorUsername;

  const handleDelete = async () => {
    if (!confirm(t("deleteConfirm"))) return;
    await apiFetch(`${API_BASE_URL}/posts/${slug}/`, { method: "DELETE" });
    router.push("/");
  };

  return (
    <article className="max-w-3xl mx-auto w-full px-margin-edge py-stack-lg">
      {post.image && (
        <div className="w-full aspect-[21/9] mb-8 rounded overflow-hidden bg-surface-container relative">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            className="object-cover"
          />
        </div>
      )}

      <header className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl text-on-surface mb-6">
          {post.title}
        </h1>
        <div className="flex items-center justify-between border-b border-outline-variant pb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div>
              <Link
                href={`/u/${authorUsername}`}
                className="font-ui text-sm text-on-surface hover:text-primary"
              >
                @{authorUsername}
              </Link>
              <div className="font-ui text-xs text-on-surface-variant">
                {formatDate(post.creation_datetime)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FollowButton
              targetUsername={authorUsername}
              targetUserUrl={post.author}
            />
            <BookmarkButton postUrl={post.url} />
            {isAuthor && (
              <>
                <Link
                  href={`/write/${post.slug}`}
                  className="font-ui text-sm text-on-surface-variant hover:text-primary"
                >
                  {t("edit")}
                </Link>
                <button
                  onClick={handleDelete}
                  className="font-ui text-sm text-on-surface-variant hover:text-error"
                >
                  {t("delete")}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <Markdown>{post.body}</Markdown>

      <div className="mt-10 border-y border-outline-variant py-4">
        <ReactionBar reactionsUrl={post.reactions} />
      </div>

      <CommentThread postId={post.id} postUrl={post.url} />
    </article>
  );
}
