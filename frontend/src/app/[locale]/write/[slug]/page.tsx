"use client";

import { use, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import { useAuth } from "@/lib/auth-context";
import { usernameFromUserUrl } from "@/lib/url-helpers";
import type { PostDetail } from "@/lib/types";
import PostForm from "@/components/PostForm";
import NotFoundState from "@/components/NotFoundState";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations("PostDetail");
  const { user, loading } = useAuth();
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

  useEffect(() => {
    if (loading || !post || post === "not-found") return;
    const isAuthor = user?.username === usernameFromUserUrl(post.author);
    if (!isAuthor) router.push(`/posts/${slug}`);
  }, [loading, user, post, slug, router]);

  if (post === "not-found") {
    return <NotFoundState message={t("notFound")} />;
  }

  if (!post || !user) return null;

  return <PostForm mode="edit" initial={post} />;
}
